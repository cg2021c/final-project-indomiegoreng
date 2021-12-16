import * as THREE from 'three';
import {
  collection,
  getDocs,
  addDoc,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from './firebase';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Boat from './classes/Boat.js';
import Trash from './classes/Trash.js';
import GameSky from './classes/GameSky.js';
import GameWater from './classes/GameWater.js';
import GameSun from './classes/GameSun.js';
import IndomieUtils from './classes/IndomieUtils.js';
import BoatControl from './classes/BoatControl.js';
import Box from './classes/Box.js';
import Crate from './classes/Crate.js';
import Refrigerator from './classes/Refrigerator.js';
import Fishes from './classes/Fishes.js';

let camera, scene, renderer;
let controls, water, sun;
let boat = null;
let fishModel = null;

let isPlaying = false;

const loader = new GLTFLoader();

let boatModel = null;

let trashes = [];

let gameOverSound = null;
let gameOverSoundLoader = null;

let fishes = [];

const TRASH_COUNT = 100;
const BOX_COUNT = 50;
const CRATE_COUNT = 50;
const REFRIGERATOR_COUNT = 10;
const GAME_DURATION = 1 * 60;

loadModels();

async function loadModels() {
  fishModel = await IndomieUtils.loadModel(loader, 'assets/fishes/scene.gltf');
  init();
}
async function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => console.log('service worker registered'))
      .catch((err) => console.log('service worker not registered', err));
  }

  const playButton = document.querySelector('#play-button');
  const playAgainButton = document.querySelector('#play-again');

  playButton.addEventListener('click', onPlayClick);
  playAgainButton.addEventListener('click', onPlayAgainClick);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    1,
    20000,
  );
  camera.position.set(30, 30, 100);

  // Load audio
  let listener = new THREE.AudioListener();
  camera.add(listener);

  let oceanSound = new THREE.Audio(listener);
  let oceanSoundLoader = new THREE.AudioLoader().load(
    'assets/audio/calm-sea.mp3',
    (result) => {
      oceanSound.setBuffer(result);
      oceanSound.setVolume(0.2);
      oceanSound.setLoop(true);
      oceanSound.play();
    },
  );

  let music = new THREE.Audio(listener);
  let musicLoder = new THREE.AudioLoader().load(
    'assets/audio/music.mp3',
    (result) => {
      music.setBuffer(result);
      music.setVolume(0.3);
      music.setLoop(true);
      music.play();
    },
  );

  gameOverSound = new THREE.Audio(listener);
  gameOverSoundLoader = new THREE.AudioLoader().load(
    'assets/audio/game-over.mp3',
    (result) => {
      gameOverSound.setBuffer(result);
    },
  );

  // Sun
  sun = new GameSun(scene, renderer);

  // Water
  water = new GameWater(scene);
  scene.add(water);

  // Skybox
  const sky = new GameSky();
  scene.add(sky);

  sun.update(sky, water);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.395;
  controls.target.set(0, 10, -100);
  controls.minDistance = 40.0;
  controls.maxDistance = 60.0;
  controls.update();

  const waterUniforms = water.material.uniforms;

  let trashCollectedSoundBuffer = null;
  let trashCollectedSoundLoader = new THREE.AudioLoader().load(
    'assets/audio/trash-collected.mp3',
    (result) => {
      trashCollectedSoundBuffer = result;
    },
  );

  for (let i = 0; i < REFRIGERATOR_COUNT; i++) {
    const refrigerator = await Refrigerator.createTrash(
      scene,
      loader,
      'assets/refrigerator/scene.gltf',
      new THREE.Audio(listener),
      trashCollectedSoundBuffer,
    );
    trashes.push(refrigerator);
  }

  for (let i = 0; i < BOX_COUNT; i++) {
    const box = await Box.createTrash(
      scene,
      loader,
      'assets/box/scene.gltf',
      new THREE.Audio(listener),
      trashCollectedSoundBuffer,
    );
    trashes.push(box);
  }

  for (let i = 0; i < CRATE_COUNT; i++) {
    const crate = await Crate.createTrash(
      scene,
      loader,
      'assets/crate/scene.gltf',
      new THREE.Audio(listener),
      trashCollectedSoundBuffer,
    );
    trashes.push(crate);
  }

  for (let i = 0; i < TRASH_COUNT; i++) {
    const trash = await Trash.createTrash(
      scene,
      loader,
      'assets/trash/scene.gltf',
      new THREE.Audio(listener),
      trashCollectedSoundBuffer,
    );
    trashes.push(trash);
  }

  window.addEventListener('resize', onWindowResize);

  boat = new Boat(loader, scene, controls, listener);
}

async function onPlayClick() {
  // Hide the game modal
  const gameModal = document.getElementById('gameModal');
  gameModal.style.display = 'none';

  const nameField = document.querySelector('#name');
  const modalOverlay = document.querySelector('#modal-overlay');
  const modalContent = document.querySelector('#modal-content');
  const topHud = document.querySelector('#top-hud');
  const leaderboard = document.querySelector('#leaderboard');

  const timerElem = document.querySelector('#timer');

  await getLeaderboardData();

  sessionStorage.setItem('current-user', nameField.value);

  modalOverlay.classList.remove('fixed');
  modalOverlay.classList.add('hidden');

  modalContent.classList.remove('inline-block');
  modalContent.classList.add('hidden');

  leaderboard.classList.remove('hidden');
  topHud.classList.remove('hidden');
  topHud.classList.add('flex', 'flex-col');

  var boatControl = new BoatControl(window, boat);

  setTimeout(() => {
    isPlaying = true;
    animate();
    startTimer(boat, GAME_DURATION, timerElem);
  }, 1000);
}

async function getLeaderboardData() {
  const leaderboard = document.querySelector('#leaderboard');
  const scoreCollectionRef = collection(db, 'score');

  const q = query(scoreCollectionRef, orderBy('score', 'desc'), limit(5));
  const scoreData = await getDocs(q);

  const listContainer = document.createElement('ol');

  let index = 1;
  const leaderboardStyles = [
    '#fa6855',
    '#e0574f',
    '#d7514d',
    '#cd4b4b',
    '#c24448',
  ];

  scoreData.forEach((doc) => {
    const listElement = `
    <li class="flex px-4 py-3 items-center justify-between bg-[${
      leaderboardStyles[index - 1]
    }]">
      <div class="flex items-center space-x-3">
        <div
          class="flex items-center justify-center w-5 h-5 bg-white rounded-full"
        >
          <p class="text-[#c24448] text-xs">${index}</p>
        </div>
        <mark class="text-sm">${doc.data().name}</mark>
      </div>
      <small>${doc.data().score}</small>
    </li>`;

    listContainer.insertAdjacentHTML('beforeend', listElement);
    index++;
  });

  leaderboard.appendChild(listContainer);
}

async function updateLeaderBoard() {
  const leaderboard = document.querySelector('#leaderboard');
  while (leaderboard.firstChild) {
    leaderboard.removeChild(leaderboard.lastChild);
  }
  await getLeaderboardData();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function isColliding(obj1, obj2) {
  return (
    Math.abs(obj1.position.x - obj2.position.x) < 15 &&
    Math.abs(obj1.position.z - obj2.position.z) < 15
  );
}

function checkCollisions() {
  if (boat.pivot) {
    trashes.forEach((trash) => {
      if (trash.trashModel) {
        if (isColliding(boat.pivot, trash.trashModel)) {
          if (trash.isCollected == false) {
            scene.remove(trash.trashModel);
            trash.setToCollected();
            spawnFishes(trash.trashModel.position);
            boat.setScore(boat.getScore() + 1);
            updateScore(boat.score);
          }
        }
      }
    });
  }
}

function startTimer(boat, duration, display) {
  console.log(isPlaying);
  let minutes,
    seconds,
    timer = duration;
  const scoreCollectionRef = collection(db, 'score');
  const progressBar = document.querySelector('#progress-bar');

  const countdown = setInterval(async function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    if (minutes > 0)
      display.textContent = 'TIME: ' + minutes + 'm ' + seconds + 's';
    else display.textContent = 'TIME: ' + seconds + 's';

    progressBar.value = (timer / GAME_DURATION) * 100;

    if (--timer < 0) {
      isPlaying = false;
      await addDoc(scoreCollectionRef, {
        name: sessionStorage.getItem('current-user'),
        score: boat.score,
      });
      gameOverSound.play();
      resetState();
      onTimesUp();
      console.log(`Score: ${boat.score}`);
      clearInterval(countdown);
    }
  }, 1000);
}

function resetState() {
  const modalTitle = document.querySelector('#final-score');
  modalTitle.textContent = `Your score is ${boat.score}`;

  boat.resetState();

  updateScore(0);
}

function updateScore(score) {
  const scoreElem = document.querySelector('#score');
  scoreElem.textContent = 'SCORE: ' + score;
}

function onTimesUp() {
  console.log('halo');

  // Show the game modal
  const gameModal = document.getElementById('gameModal');
  gameModal.style.display = 'block';

  const modalOverlay = document.querySelector('#modal-overlay-end');
  const modalContent = document.querySelector('#modal-content-end');
  const topHud = document.querySelector('#top-hud');
  const leaderboard = document.querySelector('#leaderboard');

  modalOverlay.classList.remove('hidden');
  modalOverlay.classList.add('fixed');

  modalContent.classList.remove('hidden');
  modalContent.classList.add('inline-block');

  topHud.classList.remove('flex');
  leaderboard.classList.add('hidden');
  topHud.classList.add('hidden');

  setTimeout(() => {
    isPlaying = false;
    animate();
  }, 1000);
}

async function onPlayAgainClick() {
  location.reload();
}

function spawnFishes(position) {
  const fish = Fishes.create(fishModel.clone(), position);
  scene.add(fish.fishModel);
  fishes.push(fish);
}

function animateFishes() {
  fishes.forEach((fish) => {
    if (fish.fishModel != null) {
      fish.move();
    }
  });
}

function animate() {
  if (isPlaying) requestAnimationFrame(animate);
  render();
  boat.update();
  animateFishes();
  checkCollisions();
}

function render() {
  water.material.uniforms['time'].value += 1.0 / 60.0;

  renderer.render(scene, camera);
}

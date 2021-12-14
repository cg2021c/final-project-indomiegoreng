import * as THREE from 'three';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

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
import updateScore from './js/score.js';
import { startTimer } from './js/timer.js';

let camera, scene, renderer;
let controls, water, sun;
let boat = null;

const loader = new GLTFLoader();

let boatModel = null;

let trashes = [];

const TRASH_COUNT = 100;
const BOX_COUNT = 50;
const CRATE_COUNT = 50;
const REFRIGERATOR_COUNT = 10;

init();

async function init() {
  const playButton = document.querySelector('#play-button');
  playButton.addEventListener('click', onPlayClick);

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

  var boatControl = new BoatControl(window, boat);

  animate();
}

async function onPlayClick() {
  const nameField = document.querySelector('#name');
  const modalOverlay = document.querySelector('#modal-overlay');
  const modalContent = document.querySelector('#modal-content');
  const topHud = document.querySelector('#top-hud');
  const leaderboard = document.querySelector('#leaderboard');

  const duration = 5;
  const timerElem = document.querySelector('#timer');

  await getLeaderboardData();

  sessionStorage.setItem('current-user', nameField.value);

  modalOverlay.classList.remove('fixed');
  modalOverlay.classList.add('hidden');

  modalContent.classList.remove('inline-block');
  modalContent.classList.add('hidden');

  leaderboard.classList.remove('hidden');
  topHud.classList.remove('hidden');
  topHud.classList.add('flex');

  setTimeout(() => {
    startTimer(boat, duration, timerElem);
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
          scene.remove(trash.trashModel);
          if (trash.isCollected == false) {
            trash.setToCollected();
            boat.setScore(boat.getScore() + 1);
            updateScore(boat.score);
          }
        }
      }
    });
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
  boat.update();
  checkCollisions();
}

function render() {
  water.material.uniforms['time'].value += 1.0 / 60.0;

  renderer.render(scene, camera);
}

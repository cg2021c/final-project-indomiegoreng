import * as THREE from 'three';

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

let camera, scene, renderer;
let controls, water, sun;
let boat = null;

const loader = new GLTFLoader();

let boatModel = null;

let trashes = [];
const TRASH_COUNT = 500;
const BOX_COUNT = 200;
const CRATE_COUNT = 50;
const REFRIGERATOR_COUNT = 10;

init();

async function init() {
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
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
  controls.maxDistance = 60.0;
  controls.update();

  const waterUniforms = water.material.uniforms;

  for (let i = 0; i < TRASH_COUNT; i++) {
    const trash = await Trash.createTrash(scene, loader);
    trashes.push(trash);
  }

  for (let i = 0; i < BOX_COUNT; i++) {
    const box = await Box.createBox(scene, loader);
    trashes.push(box);
  }

  for (let i = 0; i < CRATE_COUNT; i++) {
    const crate = await Crate.createCrate(scene, loader);
    trashes.push(crate);
  }

  for (let i = 0; i < REFRIGERATOR_COUNT; i++) {
    const refrigerator = await Refrigerator.createRefrigerator(scene, loader);
    trashes.push(refrigerator);
  }

  window.addEventListener('resize', onWindowResize);

  boat = new Boat(loader, scene, controls);

  var boatControl = new BoatControl(window, boat);

  animate();
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
          if (trash.taken == false) {
            trash.taken = true;
            boat.setScore(boat.getScore() + 1);
            console.log(boat.score);
            updateScore(boat.score);
          }
        }
      }
    });
    trashes.forEach((box) => {
      if (box.boxModel) {
        if (isColliding(boat.pivot, box.boxModel)) {
          scene.remove(box.boxModel);
          if (box.taken == false) {
            box.taken = true;
            boat.setScore(boat.getScore() + 1);
            console.log(boat.score);
            updateScore(boat.score);
          }
        }
      }
    });
    trashes.forEach((crate) => {
      if (crate.crateModel) {
        if (isColliding(boat.pivot, crate.crateModel)) {
          scene.remove(crate.crateModel);
          if (crate.taken == false) {
            crate.taken = true;
            boat.setScore(boat.getScore() + 1);
            console.log(boat.score);
            updateScore(boat.score);
          }
        }
      }
    });
    trashes.forEach((refrigerator) => {
      if (refrigerator.refrigeratorModel) {
        if (isColliding(boat.pivot, refrigerator.refrigeratorModel)) {
          scene.remove(refrigerator.refrigeratorModel);
          if (refrigerator.taken == false) {
            refrigerator.taken = true;
            boat.setScore(boat.getScore() + 1);
            console.log(boat.score);
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

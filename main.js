import './style.css';

import * as THREE from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer;
let controls, water, sun;

const loader = new GLTFLoader();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Boat {
  static BOAT_ACCEL = 1;
  static BOAT_DECEL = 2;
  static BOAT_IDLE = 3;

  static BOAT_BLADE_LEFT = 1;
  static BOAT_BLADE_MIDDLE = 2;

  currentState = Boat.BOAT_IDLE;

  maxSpeedAccel = 2.0;
  maxSpeedDecel = 0.5;

  acceleration = 0.05;
  deceleration = -0.05;

  rotAcceleration = 0.01;
  rotDeceleration = -0.1;

  currentBladeState = Boat.BOAT_BLADE_MIDDLE;

  lastClock = 0;
  lastClock2 = 0;

  dfux_x = 0.0005;
  dfux_y = 0.002;
  dfux_z = -0.0012;

  constructor() {
    loader.load('assets/boat/scene.gltf', (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.scale.set(3, 3, 3);
      // gltf.scene.position.set(5,13,50)
      // gltf.scene.rotation.y = 1.5
      gltf.scene.rotation.y = (3 * Math.PI) / 2;

      this.boat = gltf.scene;
      this.speed = {
        vel: 0,
        rot: 0,
      };
      this.score = 0;

      // Bounding box
      var box = new THREE.Box3().setFromObject(gltf.scene);
      box.getCenter(gltf.scene.position);
      gltf.scene.position.multiplyScalar(-1);

      var pivot = new THREE.Group();
      scene.add(pivot);
      pivot.add(gltf.scene);
      pivot.position.set(5, 2, 50);
      this.pivot = pivot;

      var axesHelper = new THREE.AxesHelper(100);
      pivot.add(axesHelper);

      // Clock
      this.clock = new THREE.Clock();
      this.clock.start();
    });
  }

  getScore() {
    return this.score;
  }

  setScore(score) {
    this.score = score;
  }

  stop() {
    this.speed.vel = 0;
    this.speed.rot = 0;
  }

  startAccelerating() {
    this.currentState = Boat.BOAT_ACCEL;
    if (this.speed.vel < 0.5) this.speed.vel = 0.5;
  }

  startAcceleratingBack() {
    this.currentState = Boat.BOAT_DECEL;
  }

  stopAccelerating() {
    this.currentState = Boat.BOAT_IDLE;
  }

  update() {
    if (this.boat) {
      if (this.clock.getElapsedTime() - this.lastClock > 0.2) {
        this.lastClock = this.clock.getElapsedTime();
        if (this.currentState == Boat.BOAT_IDLE) {
          if (this.speed.vel > 0) {
            this.speed.vel += this.deceleration;
            if (this.speed.vel < 0) {
              this.speed.vel = 0;
              this.currentState = Boat.BOAT_IDLE;
            }
          } else if (this.speed.vel < 0) {
            this.speed.vel -= this.deceleration;
            if (this.speed.vel > 0) {
              this.speed.vel = 0;
              this.currentState = Boat.BOAT_IDLE;
            }
          }
        } else if (this.currentState == Boat.BOAT_ACCEL) {
          this.speed.vel += this.acceleration;
          if (this.speed.vel > this.maxSpeedAccel) {
            this.speed.vel = this.maxSpeedAccel;
          }
        } else if (this.currentState == Boat.BOAT_DECEL) {
          this.speed.vel -= this.acceleration;
          if (this.speed.vel < -this.maxSpeedDecel) {
            this.speed.vel = -this.maxSpeedDecel;
          }
        }
        // console.log("Boat state is " + this.currentState)
        // console.log("Boat Blade state is " + this.currentBladeState)
        // console.log("Boat speed is" + this.speed.vel)
      }

      if (this.currentBladeState == Boat.BOAT_BLADE_RIGHT) {
        this.pivot.rotation.y -= this.rotAcceleration;
        if (this.pivot.rotation.y < 2 * Math.PI)
          this.pivot.rotation.y += 2 * Math.PI;
      } else if (this.currentBladeState == Boat.BOAT_BLADE_LEFT) {
        this.pivot.rotation.y += this.rotAcceleration;
        if (this.pivot.rotation.y > 2 * Math.PI)
          this.pivot.rotation.y -= 2 * Math.PI;
      } else if (this.currentBladeState == Boat.BOAT_BLADE_MIDDLE) {
        // Do nothing
      }

      if (this.currentState == Boat.BOAT_ACCEL) {
        this.boat.rotation.z += 0.001;
        if (this.boat.rotation.z > Math.PI / 20) {
          this.boat.rotation.z = Math.PI / 20;
        }
      } else {
        this.boat.rotation.z -= 0.001;
        if (this.boat.rotation.z < 0) {
          this.boat.rotation.z = 0;
        }
      }
      // dfux
      this.boat.rotation.x += this.dfux_x;
      if (
        this.boat.rotation.x < -Math.PI / 40 ||
        this.boat.rotation.x > Math.PI / 40
      ) {
        this.dfux_x *= -1;
      }
      if (boat.curentState == Boat.BOAT_IDLE) {
        this.boat.rotation.y += this.dfux_y;
        if (
          this.boat.rotation.y < -Math.PI / 40 ||
          this.boat.rotation.y > Math.PI / 40
        ) {
          this.dfux_y *= -1;
        }
        this.boat.rotation.z += this.dfux_z;
        if (
          this.boat.rotation.z < -Math.PI / 40 ||
          this.boat.rotation.z > Math.PI / 40
        ) {
          this.dfux_z *= -1;
        }
      }

      this.pivot.translateZ(this.speed.vel);

      controls.target.set(
        this.pivot.position.x,
        this.pivot.position.y,
        this.pivot.position.z,
      );
      controls.update();
    }
  }
}

const boat = new Boat();

class Trash {
  constructor(_scene) {
    scene.add(_scene);
    _scene.scale.set(1.5, 1.5, 1.5);
    if (Math.random() > 0.6) {
      _scene.position.set(random(-100, 100), -0.5, random(-100, 100));
    } else {
      _scene.position.set(random(-500, 500), -0.5, random(-1000, 1000));
    }

    this.trash = _scene;
    this.taken = false;
  }
}

async function loadModel(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
      resolve(gltf.scene);
    });
  });
}

let boatModel = null;
async function createTrash() {
  if (!boatModel) {
    boatModel = await loadModel('assets/trash/scene.gltf');
  }
  return new Trash(boatModel.clone());
}

let trashes = [];
const TRASH_COUNT = 500;

init();
animate();

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

  sun = new THREE.Vector3();

  // Water

  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      'assets/water/water.jpg',
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      },
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;

  scene.add(water);

  // Skybox

  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;

  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();

    scene.environment = pmremGenerator.fromScene(sky).texture;
  }

  updateSun();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.395;
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
  controls.maxDistance = 60.0;
  controls.update();

  const waterUniforms = water.material.uniforms;

  for (let i = 0; i < TRASH_COUNT; i++) {
    const trash = await createTrash();
    trashes.push(trash);
  }

  window.addEventListener('resize', onWindowResize);

  window.addEventListener('keydown', function (e) {
    if (e.key == 'ArrowUp') {
      boat.startAccelerating();
    } else if (e.key == 'ArrowDown') {
      boat.startAcceleratingBack();
    } else if (e.key == 'ArrowRight') {
      boat.currentBladeState = Boat.BOAT_BLADE_RIGHT;
    } else if (e.key == 'ArrowLeft') {
      boat.currentBladeState = Boat.BOAT_BLADE_LEFT;
    }
  });
  window.addEventListener('keyup', function (e) {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
      boat.stopAccelerating();
    } else if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
      boat.currentBladeState = Boat.BOAT_BLADE_MIDDLE;
    }
  });
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
      if (trash.trash) {
        if (isColliding(boat.pivot, trash.trash)) {
          scene.remove(trash.trash);
          if (trash.taken == false) {
            trash.taken = true;
            boat.setScore(boat.getScore() + 1);
            console.log(boat.score);
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

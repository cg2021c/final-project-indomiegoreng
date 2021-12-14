import * as THREE from 'three';

/**
 * Class Boat
 *
 * @class Boat
 */
export default class Boat {
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

  boatSound = null;
  boatSoundLoader = null;
  boatSounds = {};

  constructor(loader, scene, controls, listener) {
    this.boatSound = new THREE.Audio(listener);
    this.boatSoundLoader = new THREE.AudioLoader();
    this.controls = controls;
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

      // var axesHelper = new THREE.AxesHelper(100);
      // pivot.add(axesHelper);

      // Clock
      this.clock = new THREE.Clock();
      this.clock.start();
    });

    // Audio
    this.loadAudio();
  }

  loadAudio() {
    this.boatSoundLoader.load('assets/audio/boat-running.mp3', (result) => {
      this.boatSounds['running'] = result;
    });
    this.boatSoundLoader.load('assets/audio/boat-idle.mp3', (result) => {
      this.boatSounds['idle'] = result;
      this.boatSound.setBuffer(result);
      this.boatSound.setLoop(true);
      this.boatSound.setVolume(0.2);
      this.boatSound.play();
    });
  }

  playAudio(soundName, loop, volume) {
    this.stopAudio();
    this.boatSound.setBuffer(this.boatSounds[soundName]);
    this.boatSound.setLoop(loop);
    this.boatSound.setVolume(volume);
    this.boatSound.play();
  }

  stopAudio() {
    if (this.boatSound.isPlaying) {
      this.boatSound.setLoop(false);
      this.boatSound.stop();
      this.boatSound.isPlaying = false;
    }
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
      if (this.boat.curentState == Boat.BOAT_IDLE) {
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

      this.controls.target.set(
        this.pivot.position.x,
        this.pivot.position.y,
        this.pivot.position.z,
      );
      this.controls.update();
    }
  }
}

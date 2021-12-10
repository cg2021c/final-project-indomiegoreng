import { Water } from 'three/examples/jsm/objects/Water.js';
import * as THREE from 'three';

/**
 * Class Water
 *
 * @class Water
 */
export default class GameWater extends Water {
  constructor(scene) {
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    super(waterGeometry, {
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
    this.rotation.x = -Math.PI / 2;
  }
}

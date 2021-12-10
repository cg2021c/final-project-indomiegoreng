import * as THREE from 'three';

/**
 * Class GameSun
 *
 * @class GameSun
 */
export default class GameSun extends THREE.Vector3 {
  parameters = {
    elevation: 2,
    azimuth: 180,
  };
  pmremGenerator = null;
  constructor(scene, renderer) {
    super();
    this.scene = scene;
    this.pmremGenerator = new THREE.PMREMGenerator(renderer);
  }

  update(sky, water) {
    const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation);
    const theta = THREE.MathUtils.degToRad(this.parameters.azimuth);

    this.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms['sunPosition'].value.copy(this);
    water.material.uniforms['sunDirection'].value.copy(this).normalize();

    this.scene.environment = this.pmremGenerator.fromScene(sky).texture;
  }
}

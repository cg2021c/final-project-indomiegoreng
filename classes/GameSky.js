import { Sky } from 'three/examples/jsm/objects/Sky.js';

/**
 * Class Sky
 *
 * @class Sky
 */
export default class GameSky extends Sky {
  constructor() {
    super();
    this.scale.setScalar(10000);

    const skyUniforms = this.material.uniforms;

    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;
  }
}

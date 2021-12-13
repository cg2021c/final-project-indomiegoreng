/**
 * Class Crate
 *
 * @class Crate
 */
import IndomieUtils from './IndomieUtils.js';

export default class Crate {
  taken = false;
  constructor(scene, crateModel) {
    scene.add(crateModel);
    crateModel.scale.set(0.07, 0.07, 0.07);
    if (Math.random() > 0.9) {
      crateModel.position.set(
        IndomieUtils.random(-200, 200),
        -0.5,
        IndomieUtils.random(-200, 200),
      );
    } else {
      crateModel.position.set(
        IndomieUtils.random(-500, 500),
        -0.5,
        IndomieUtils.random(-1000, 1000),
      );
    }

    this.crateModel = crateModel;
    this.taken = false;
  }
  static async createCrate(scene, loader) {
    if (!this.crateModel) {
      this.crateModel = await IndomieUtils.loadModel(
        loader,
        'assets/crate/scene.gltf',
      );
    }
    return new this(scene, this.crateModel.clone());
  }
}

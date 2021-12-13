/**
 * Class Box
 *
 * @class Box
 */
import IndomieUtils from './IndomieUtils.js';

export default class Box {
  taken = false;
  constructor(scene, boxModel) {
    scene.add(boxModel);
    boxModel.scale.set(0.05, 0.05, 0.05);
    if (Math.random() > 0.9) {
      boxModel.position.set(
        IndomieUtils.random(-200, 200),
        -0.5,
        IndomieUtils.random(-200, 200),
      );
    } else {
      boxModel.position.set(
        IndomieUtils.random(-500, 500),
        -0.5,
        IndomieUtils.random(-1000, 1000),
      );
    }

    this.boxModel = boxModel;
    this.taken = false;
  }
  static async createBox(scene, loader) {
    if (!this.boxModel) {
      this.boxModel = await IndomieUtils.loadModel(
        loader,
        'assets/box/scene.gltf',
      );
    }
    return new this(scene, this.boxModel.clone());
  }
}

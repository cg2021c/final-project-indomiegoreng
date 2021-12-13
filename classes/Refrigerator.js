/**
 * Class Refrigerator
 *
 * @class Refrigerator
 */
import IndomieUtils from './IndomieUtils.js';

export default class Refrigerator {
  taken = false;
  constructor(scene, refrigeratorModel) {
    scene.add(refrigeratorModel);
    refrigeratorModel.scale.set(1.5, 1.5, 1.5);
    if (Math.random() > 0.9) {
      refrigeratorModel.position.set(
        IndomieUtils.random(-200, 200),
        -5,
        IndomieUtils.random(-200, 200),
      );
    } else {
      refrigeratorModel.position.set(
        IndomieUtils.random(-500, 500),
        -5,
        IndomieUtils.random(-1000, 1000),
      );
    }

    this.refrigeratorModel = refrigeratorModel;
    this.taken = false;
  }
  static async createRefrigerator(scene, loader) {
    if (!this.refrigeratorModel) {
      this.refrigeratorModel = await IndomieUtils.loadModel(
        loader,
        'assets/refrigerator/scene.gltf',
      );
    }
    return new this(scene, this.refrigeratorModel.clone());
  }
}

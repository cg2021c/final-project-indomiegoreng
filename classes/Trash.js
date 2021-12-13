/**
 * Class Trash
 *
 * @class Trash
 */
import IndomieUtils from './IndomieUtils.js';

export default class Trash {
  taken = false;
  constructor(scene, trashModel) {
    scene.add(trashModel);
    trashModel.scale.set(1.5, 1.5, 1.5);
    if (Math.random() > 0.9) {
      trashModel.position.set(
        IndomieUtils.random(-200, 200),
        -0.5,
        IndomieUtils.random(-200, 200),
      );
    } else {
      trashModel.position.set(
        IndomieUtils.random(-500, 500),
        -0.5,
        IndomieUtils.random(-1000, 1000),
      );
    }

    this.trashModel = trashModel;
    this.taken = false;
  }
  static async createTrash(scene, loader) {
    if (!this.trashModel) {
      this.trashModel = await IndomieUtils.loadModel(
        loader,
        'assets/trash/scene.gltf',
      );
    }
    return new this(scene, this.trashModel.clone());
  }
}

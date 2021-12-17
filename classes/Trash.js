/**
 * Class Trash
 *
 * @class Trash
 */
import IndomieUtils from './IndomieUtils.js';

export default class Trash {
  isCollected = false;
  constructor(trashModel) {
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
    this.isCollected = false;
  }
  static async createTrash(trashModel) {
    return new this(trashModel);
  }
  setToCollected() {
    this.isCollected = true;
  }
}

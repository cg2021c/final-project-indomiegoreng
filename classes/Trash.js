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
    if (Math.random() > 0.6) {
      trashModel.position.set(
        IndomieUtils.random(-100, 100),
        -0.5,
        IndomieUtils.random(-100, 100),
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
}

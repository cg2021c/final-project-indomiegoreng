/**
 * Class Rock
 *
 * @class Rock
 */
import IndomieUtils from './IndomieUtils.js';

export default class Rock {
  isCollected = false;
  constructor(rockModel) {
    rockModel.scale.set(0.1, 0.1, 0.1);
    if (Math.random() > 0.9) {
      rockModel.position.set(
        IndomieUtils.random(-200, 200),
        -0.5,
        IndomieUtils.random(-200, 200),
      );
    } else {
      rockModel.position.set(
        IndomieUtils.random(-500, 500),
        -0.5,
        IndomieUtils.random(-1000, 1000),
      );
    }

    this.rockModel = rockModel;
  }
  static async createRock(rockModel) {
    return new this(rockModel);
  }
}

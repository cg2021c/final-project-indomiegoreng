/**
 * Class Fishes
 *
 * @class Fishes
 */
import IndomieUtils from './IndomieUtils.js';

export default class Fishes {
  velocity = 1.23;
  constructor(fishModel, position) {
    this.fishModel = fishModel;

    this.fishModel.position.set(position.x, 0, position.z);
    this.fishModel.rotation.x = (90.0 / 180.0) * Math.PI;
  }
  static create(fishModel, position) {
    return new this(fishModel, position);
  }

  flip() {
    let newRot = this.fishModel.rotation.x + (180.0 / 180.0) * Math.PI;
    while (newRot > 2 * Math.PI) newRot -= 2 * Math.PI;
    this.fishModel.rotation.x = newRot;
  }

  move() {
    if (this.fishModel.position.y < -500.0) {
      this.fishModel.position.y = -500.0;
      this.velocity *= -1;
      this.flip();
    } else if (this.fishModel.position.y > 24.0) {
      this.fishModel.position.y = 24.0;
      this.velocity *= -1;
      this.flip();
    }
    this.fishModel.position.y += this.velocity;
  }
}

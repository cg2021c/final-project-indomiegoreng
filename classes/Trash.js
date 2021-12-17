/**
 * Class Trash
 *
 * @class Trash
 */
import IndomieUtils from './IndomieUtils.js';

export default class Trash {
  isCollected = false;
  constructor(trashModel, sound, soundBuffer) {
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
    this.trashCollectedSound = sound;
    this.trashCollectedSound.setBuffer(soundBuffer);
  }
  static async createTrash(trashModel, sound, soundBuffer) {
    return new this(trashModel, sound, soundBuffer);
  }
  playTrashCollectedSound() {
    this.stopTrashCollectedSound();
    this.trashCollectedSound.play();
  }
  stopTrashCollectedSound() {
    if (this.trashCollectedSound.isPlaying) {
      this.trashCollectedSound.stop();
    }
  }
  setToCollected() {
    this.isCollected = true;
    this.playTrashCollectedSound();
  }
}

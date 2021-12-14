/**
 * Class Trash
 *
 * @class Trash
 */
import IndomieUtils from './IndomieUtils.js';

export default class Trash {
  isCollected = false;
  constructor(scene, trashModel, sound, soundBuffer) {
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
    this.isCollected = false;
    this.trashCollectedSound = sound;
    this.trashCollectedSound.setBuffer(soundBuffer);
  }
  static async createTrash(scene, loader, url, sound, soundBuffer) {
    if (!this.trashModel) {
      this.trashModel = await IndomieUtils.loadModel(loader, url);
    }
    return new this(scene, this.trashModel.clone(), sound, soundBuffer);
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

/**
 * Class Box
 *
 * @class Box
 */
import IndomieUtils from './IndomieUtils.js';
import Trash from './Trash.js';

export default class Box extends Trash {
  constructor(trashModel, sound, soundBuffer) {
    super(trashModel, sound, soundBuffer);
    this.trashModel.scale.set(0.05, 0.05, 0.05);
  }
}

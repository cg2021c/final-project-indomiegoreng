/**
 * Class Crate
 *
 * @class Crate
 */
import IndomieUtils from './IndomieUtils.js';
import Trash from './Trash.js';

export default class Crate extends Trash {
  constructor(trashModel, sound, soundBuffer) {
    super(trashModel, sound, soundBuffer);
    this.trashModel.scale.set(0.07, 0.07, 0.07);
  }
}

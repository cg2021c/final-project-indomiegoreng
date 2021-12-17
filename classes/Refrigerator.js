/**
 * Class Refrigerator
 *
 * @class Refrigerator
 */
import IndomieUtils from './IndomieUtils.js';
import Trash from './Trash.js';

export default class Refrigerator extends Trash {
  constructor(trashModel, sound, soundBuffer) {
    super(trashModel, sound, soundBuffer);
  }
}

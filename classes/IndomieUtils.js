/**
 * Class IndomieUtils
 *
 * @class IndomieUtils
 */
export default class IndomieUtils {
  static random(min, max) {
    return Math.random() * (max - min) + min;
  }
}

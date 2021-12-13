/**
 * Class IndomieUtils
 *
 * @class IndomieUtils
 */
export default class IndomieUtils {
  static random(min, max) {
    var result = 0;
    do {
      result = Math.random() * (max - min) + min;
    } while (result < 8 && result > -8);
    return result;
  }
  static async loadModel(loader, url) {
    return new Promise((resolve, reject) => {
      loader.load(url, (gltf) => {
        resolve(gltf.scene);
      });
    });
  }
}

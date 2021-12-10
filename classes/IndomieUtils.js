/**
 * Class IndomieUtils
 *
 * @class IndomieUtils
 */
export default class IndomieUtils {
  static random(min, max) {
    return Math.random() * (max - min) + min;
  }
  static async loadModel(loader, url) {
    return new Promise((resolve, reject) => {
      loader.load(url, (gltf) => {
        resolve(gltf.scene);
      });
    });
  }
}

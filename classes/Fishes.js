/**
 * Class Fishes
 *
 * @class Fishes
 */
import IndomieUtils from './IndomieUtils.js';

export default class Fishes {
  constructor(scene, fishesModel, position) {
    scene.add(fishesModel);
    fishesModel.position.set(position.x, 0, position.z);
    //fishesModel.rotation.x = Math.PI / 2;

    this.fishesModel = fishesModel;
    //console.log(this.fishesModel);
  }
  static async create(scene, loader, position) {
    if (!this.fishesModel) {
      this.fishesModel = await IndomieUtils.loadModel(
        loader,
        'assets/fishes/scene.gltf',
      );
    }
    return new this(scene, this.fishesModel.clone(), position);
  }
}

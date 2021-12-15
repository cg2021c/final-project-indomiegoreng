/**
 * Class BoatControl
 *
 * @class BoatControl
 */

import Boat from './Boat.js';

export default class BoatControl {
  constructor(window, boat) {
    window.addEventListener('keydown', function (e) {
      if (e.keyCode == 87) {
        boat.playAudio('running', true, 0.5);
        boat.startAccelerating();
      } else if (e.keyCode == 83) {
        boat.startAcceleratingBack();
      } else if (e.keyCode == 68) {
        boat.currentBladeState = Boat.BOAT_BLADE_RIGHT;
      } else if (e.keyCode == 65) {
        boat.currentBladeState = Boat.BOAT_BLADE_LEFT;
      }
    });
    window.addEventListener('keyup', function (e) {
      if (e.keyCode == 87 || e.keyCode == 83) {
        boat.playAudio('idle', true, 0.2);
        boat.stopAccelerating();
      } else if (e.keyCode == 65 || e.keyCode == 68) {
        boat.currentBladeState = Boat.BOAT_BLADE_MIDDLE;
      }
    });
  }
}

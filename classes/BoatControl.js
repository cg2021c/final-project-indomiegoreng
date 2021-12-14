/**
 * Class BoatControl
 *
 * @class BoatControl
 */

import Boat from './Boat.js';

export default class BoatControl {
  constructor(window, boat) {
    window.addEventListener('keydown', function (e) {
      if (e.key == 'ArrowUp') {
        boat.playAudio('running', true, 0.5);
        boat.startAccelerating();
      } else if (e.key == 'ArrowDown') {
        boat.startAcceleratingBack();
      } else if (e.key == 'ArrowRight') {
        boat.currentBladeState = Boat.BOAT_BLADE_RIGHT;
      } else if (e.key == 'ArrowLeft') {
        boat.currentBladeState = Boat.BOAT_BLADE_LEFT;
      }
    });
    window.addEventListener('keyup', function (e) {
      if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
        boat.playAudio('idle', true, 0.2);
        boat.stopAccelerating();
      } else if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
        boat.currentBladeState = Boat.BOAT_BLADE_MIDDLE;
      }
    });
  }
}

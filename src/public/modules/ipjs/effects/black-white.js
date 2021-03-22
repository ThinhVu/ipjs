/**
 * @implements iEffect
 */
import { getGayScale } from './gray-scale.js';

export default class BlackWhite {
  /**
   * @param {Number} threshold
   */
  constructor(threshold) {
    this._t = threshold
  }

  apply(img) {
    img.each(px => px.r = px.g = px.b = (getGayScale(px) < this._t) ? 0 : 255)
  }
}

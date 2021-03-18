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
    let h = img.height
    let w = img.width
    let px
    for (let row = 0; row < h; ++row) {
      for (let col = 0; col < w; ++col) {
        px = img.px(row, col)
        px.r = px.g = px.b = (getGayScale(px) < this._t) ? 0 : 255;
      }
    }
  }
}

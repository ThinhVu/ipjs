import Channel from '../common/channel.js';

/**
 * @interface AdditiveConfig
 */

/**
 * @field {Channel} AdditiveConfig#channel
 * @field {Number} value
 */

/**
 * @implements iEffect
 */
export default class Divide {
  constructor() {}

  /**
   * apply effect
   * @param {Pixmap} img
   */
  apply(img) {
    img.each(px => {
      px.r = Math.floor(px.r * 20 / 24);
      px.g = Math.floor(px.g * 20 / 24);
      px.b = Math.floor(px.b * 20 / 24);
    })
  }
}

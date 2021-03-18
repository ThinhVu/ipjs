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
export default class Additive {
  /**
   * @param {Array<AdditiveConfig>} cfg
   */
  constructor(cfg) {
    this._cfg = cfg
  }

  /**
   * apply effect
   * @param {Pixmap} img
   */
  apply(img) {
    const fx = {
      [Channel.A]: (px, v) => px.a += v,
      [Channel.R]: (px, v) => px.r += v,
      [Channel.G]: (px, v) => px.g += v,
      [Channel.B]: (px, v) => px.b += v,
      [Channel.RGB]: (px, v) => {
        px.r += this._value;
        px.g += this._value;
        px.b += this._value;
      }
    }

    for(let col = 0; col < img.width; col++) {
      for(let row = 0; row < img.height; row++) {
        for(let {channel, value} of this._cfg) {
          fx[channel](img.px(row, col), value)
        }
      }
    }
  }
}

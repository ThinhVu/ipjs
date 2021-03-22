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
        px.r += v;
        px.g += v;
        px.b += v;
      }
    }
    img.each(px => this._cfg.forEach(({channel, value}) => fx[channel](px, value)))
  }
}

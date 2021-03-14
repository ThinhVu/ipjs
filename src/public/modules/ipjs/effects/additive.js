import Channel from '../common/channel.js';

/**
 * @implements iEffect
 */
export default class Additive {
  /**
   * @param {Channel} channel
   * @param {Number} value
   */
  constructor(channel, value) {
    this._channel = channel
    this._value = value
  }

  /**
   * apply effect
   * @param {Pixmap} img
   */
  apply(img) {
    const fx = {
      [Channel.A]: (px) => px.a += this._value,
      [Channel.R]: (px) => px.r += this._value,
      [Channel.G]: (px) => px.g += this._value,
      [Channel.B]: (px) => px.b += this._value,
      [Channel.RGB]: (px) => {
        px.r += this._value;
        px.g += this._value;
        px.b += this._value;
      }
    }

    for(let col = 0; col < img.width; col++) {
      for(let row = 0; row < img.height; row++) {
        fx[this._channel](img.px(row, col))
      }
    }
  }
}

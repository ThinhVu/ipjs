import BaseBlend from '../BaseBlend.js';

export default class Multiply extends BaseBlend {
  blendPx(basePx, blendPx, compositePx) {
    // do with alpha stuff
    let alphaB = blendPx.a
    compositePx.r = Math.floor(basePx.r * blendPx.r * alphaB / 65025)
    compositePx.g = Math.floor(basePx.g * blendPx.g * alphaB / 65025)
    compositePx.b = Math.floor(basePx.b * blendPx.b * alphaB / 65025)
  }
}

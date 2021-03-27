import BaseBlend from '../BaseBlend.js';

export default class Multiply extends BaseBlend {
  blendPx(lowerLayer, upperLayer, outPx) {
    let lowerAlpha = lowerLayer.a
    outPx.r = Math.floor(lowerLayer.r * lowerAlpha * upperLayer.r / 65025)
    outPx.g = Math.floor(lowerLayer.g * lowerAlpha * upperLayer.g / 65025)
    outPx.b = Math.floor(lowerLayer.b * lowerAlpha * upperLayer.b / 65025)
  }
}

// 0.5 * 0.1 * 0.2 * 0.3

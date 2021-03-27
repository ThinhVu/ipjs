import BaseBlend from '../BaseBlend.js';

export default class Normal extends BaseBlend {
  blendPx(lowerLayer, upperLayer, outputResult) {
    // A over B
    // https://en.wikipedia.org/wiki/Alpha_compositing
    const upperAlpha = upperLayer.a / 255
    const lowerAlpha = lowerLayer.a / 255
    const lowerAlphaOut = lowerAlpha * (1 - upperAlpha)
    const alpha0 = (upperAlpha + lowerAlphaOut)
    let alphaFn = (Ca, Cb) => (Ca * upperAlpha + Cb * lowerAlphaOut) / alpha0
    outputResult.r = alphaFn(upperLayer.r, lowerLayer.r)
    outputResult.g = alphaFn(upperLayer.g, lowerLayer.g)
    outputResult.b = alphaFn(upperLayer.b, lowerLayer.b)
  }
}

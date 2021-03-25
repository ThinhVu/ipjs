import BaseBlend from '../BaseBlend.js';

export default class Normal extends BaseBlend {
  blendPx(basePx, blendPx, compositePx) {
    // A over B
    // https://en.wikipedia.org/wiki/Alpha_compositing
    const alphaA = (blendPx.a / 255)
    const alphaB = (basePx.a / 255)
    const alphaBOut = alphaB * (1 - alphaA)
    const alpha0 = (alphaA + alphaB * (1 - alphaA))
    let alphaFn = (Ca, Cb) => (Ca * alphaA + Cb * alphaBOut) / alpha0
    compositePx.r = alphaFn(blendPx.r, basePx.r)
    compositePx.g = alphaFn(blendPx.g, basePx.g)
    compositePx.b = alphaFn(blendPx.b, basePx.b)
  }
}

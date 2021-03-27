import BaseBlend from '../BaseBlend.js';

export default class Darken extends BaseBlend {
  blendPx(lowerLayer, upperLayer, outputResult) {
    // const upperAlpha = upperLayer.a / 255
    // const lowerAlpha = lowerLayer.a / 255
    // let min = (Cu, Cl) => Math.floor((Cu * upperAlpha <= Cl * lowerAlpha) ? (Cu * upperAlpha / lowerAlpha) : Cl)
    let min = (Cu, Cl) => Cu < Cl ? Cu : Cl
    outputResult.r = min(upperLayer.r, lowerLayer.r)
    outputResult.g = min(upperLayer.g, lowerLayer.g)
    outputResult.b = min(upperLayer.b, lowerLayer.b)
  }
}

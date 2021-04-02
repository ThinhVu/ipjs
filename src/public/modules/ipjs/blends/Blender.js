const blendModes = {
  // normal
  normal: (a, b) => a,

  // dissolve
  dissolve: (a, b) => throw "not implemented",

  // lighten
  lighten: (a, b) => (b > a) ? b : a,
  add: (a, b) => Math.min(255, a + b),
  screen: (a, b) => 255 - (((255 - a) * (255 - b)) >> 8),
  screenDodge: (a, b) => throw "not impl",
  colorDodge: (a, b) => b === 255 ? b : Math.min(255, ((a << 8 ) / (255 - b))),
  linearDodge: (a, b) => blendModes.add(a, b),
  divideDodge: (a, b) => throw "not impl",
  lighterColor: (a, b) => throw "not impl",

  // darken
  darken: (a, b) => (b > a) ? a : b,
  darkerColor: (a, b) => throw "not impl",
  multiply: (a, b) => a * b / 255,
  multiplyBurn: (a, b) => throw "not impl",
  average: (a, b) => (a + b) / 2,
  colorBurn: (a, b) => b === 0 ? b : Math.max(0, (255 - ((255 - a) << 8 ) / b)),
  linearBurn: (a, b) => blendModes.subtract(a, b),

  // comparative #
  difference: (a, b) => Math.abs(a - b),
  divide: (a, b) => throw "not impl",
  exclusion: (a, b) => a + b - 2 * a * b / 255,
  subtract: (a, b) => (a + b < 255) ? 0 : a + b - 255,

  // contrast
  overlay: (a, b) => b < 128 ? (2 * a * b / 255) : (255 - 2 * (255 - a) * (255 - b) / 255),
  softLight: (a, b) => b < 128 ? (2 * ((a >> 1) + 64)) * (b / 255) : 255 - (2 * (255 - (( a >> 1) + 64)) * (255 - b) / 255),
  hardLight: (a, b) => blendModes.overlay(b, a),
  linearLight: (a, b) => b < 128 ? blendModes.linearBurn(a, 2 * b) : blendModes.linearDodge(a, (2 * (b - 128))),
  pinLight: (a, b) => b < 128 ? blendModes.darken(a, 2 * b) : blendModes.lighten(a, (2 * (b - 128))),
  vividLight: (a, b) => b < 128 ? blendModes.colorBurn(a, 2 * b) : blendModes.colorDodge(a, (2 * (b - 128))),
  hardMix: (a, b) => blendModes.vividLight(a, b) < 128 ? 0 : 255,

  // composite
  color: (a, b) => throw "not impl",
  hue: (a, b) => throw "not impl",
  luminosity: (a, b) => throw "not impl",
  saturation: (a, b) => throw "not impl",

  // un-category
  negation: (a, b) => 255 - Math.abs(255 - a - b),
  reflect: (a, b) => b === 255 ? b : Math.min(255, (a * a / (255 - b))),
  glow: (a, b) => blendModes.reflect(b, a),
  phoenix: (a, b) => Math.min(a, b) - Math.max(a, b) + 255,
};

export default class Blender {
  constructor(mode) {
    this.mode = mode
  }
  /**
   * Blend blendLayer to baseLayer, output result store in compositeLayer
   * @param {Pixmap} lowerLayer
   * @param {Pixmap} upperLayer
   * @param {Pixmap} outputResult
   * @param {Number} opacity
   */
  blend(lowerLayer, upperLayer, outputResult, opacity) {
    let w = lowerLayer.width
    let h = lowerLayer.height
    let lowerPx
    let upperPx
    let compositePx
    let r, g, b
    const blendMode = blendModes[this.mode]
    let alpha1 = 1 - opacity
    for(let row=0; row<h; ++row) {
      for (let col=0; col<w; ++col) {
        lowerPx = lowerLayer.px(row, col)
        upperPx = upperLayer.px(row, col)

        // calculate blended color
        r = blendMode(upperPx.r, lowerPx.r)
        g = blendMode(upperPx.g, lowerPx.g)
        b = blendMode(upperPx.b, lowerPx.b)

        // alpha composition
        compositePx = outputResult ? outputResult.px(row, col) : upperPx
        compositePx.r = r * opacity + lowerPx.r * alpha1
        compositePx.g = g * opacity + lowerPx.g * alpha1
        compositePx.b = b * opacity + lowerPx.b * alpha1
        compositePx.a = 255
      }
    }
  }
}

// https://github.com/koteus/hipsterize
var blendModes = {
  normal: function(a, b) {
    return a;
  },

  lighten: function(a, b) {
    return (b > a) ? b : a;
  },

  darken: function(a, b) {
    return (b > a) ? a : b;
  },

  multiply: function(a, b) {
    return (a * b) / 255;
  },

  average: function(a, b) {
    return (a + b) / 2;
  },

  add: function(a, b) {
    return Math.min(255, a + b);
  },

  // #
  substract: function(a, b) {
    return (a + b < 255) ? 0 : a + b - 255;
  },

  difference: function(a, b) {
    return Math.abs(a - b);
  },

  negation: function(a, b) {
    return 255 - Math.abs(255 - a - b);
  },

  screen: function(a, b) {
    return 255 - (((255 - a) * (255 - b)) >> 8);
  },

  exclusion: function(a, b) {
    return a + b - 2 * a * b / 255;
  },

  overlay: function(a, b) {
    return b < 128
        ? (2 * a * b / 255)
        : (255 - 2 * (255 - a) * (255 - b) / 255);
  },

  softLight: function(a, b) {
    return b < 128
        ? (2 * ((a >> 1) + 64)) * (b / 255)
        : 255 - (2 * (255 - (( a >> 1) + 64)) * (255 - b) / 255);
  },

  hardLight: function(a, b) {
    return blendModes.overlay(b, a);
  },

  // #
  colorDodge: function(a, b) {
    return b == 255 ? b : Math.min(255, ((a << 8 ) / (255 - b)));
  },

  // #
  colorBurn: function(a, b) {
    return b == 0 ? b : Math.max(0, (255 - ((255 - a) << 8 ) / b));
  },

  linearDodge: function(a, b) {
    return blendModes.add(a, b);
  },

  linearBurn: function(a, b) {
    return blendModes.substract(a, b);
  },

  // #
  linearLight: function(a, b) {
    return b < 128
        ? blendModes.linearBurn(a, 2 * b)
        : blendModes.linearDodge(a, (2 * (b - 128)));
  },

  vividLight: function(a, b) {
    return b < 128
        ? blendModes.colorBurn(a, 2 * b)
        : blendModes.colorDodge(a, (2 * (b - 128)));
  },

  // #
  pinLight: function(a, b) {
    return b < 128
        ? blendModes.darken(a, 2 * b)
        : blendModes.lighten(a, (2 * (b - 128)));
  },

  hardMix: function(a, b) {
    return blendModes.vividLight(a, b) < 128 ? 0 : 255;
  },

  reflect: function(a, b) {
    return b == 255 ? b : Math.min(255, (a * a / (255 - b)));
  },

  glow: function(a, b) {
    return blendModes.reflect(b, a);
  },

  phoenix: function(a, b) {
    return Math.min(a, b) - Math.max(a, b) + 255;
  }
};

export default class BaseBlend {
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

        // this.blendPx(lowerPx, upperPx, upperPx)
      }
    }
  }

  blendPx(basePx, blendPx, compositePx) {
    console.error('not impl')
  }
}

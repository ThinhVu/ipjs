export default class BaseBlend {
  /**
   * Blend blendLayer to baseLayer, output result store in compositeLayer
   * @param {Pixmap} baseLayer
   * @param {Pixmap} blendLayer
   * @param {Pixmap} compositeLayer
   */
  blend(baseLayer, blendLayer, compositeLayer) {
    let w = baseLayer.width
    let h = baseLayer.height
    let basePx
    let blendPx
    let compositePx
    for(let row=0; row<h; ++row)
      for (let col=0; col<w; ++col) {
        basePx = baseLayer.px(row, col)
        blendPx = blendLayer.px(row, col)
        compositePx = compositeLayer ? compositeLayer.px(row, col) : basePx
        this.blendPx(basePx, blendPx, compositePx)
      }
  }
  blendPx(basePx, blendPx, compositePx) {
    console.error('not impl')
  }
}

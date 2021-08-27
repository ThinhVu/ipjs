export default class IPJs {
  constructor() {
    this.fxs = []
  }

  /**
   * add effect to effectChain
   * @param {iEffect} fx
   */
  add(fx) {
    this.fxs.push(fx)
  }

  /**
   * Process an image data
   * @param {Pixmap} img
   */
  process(img) {
    for(let fx of this.fxs)
      fx.apply(img)
  }
}

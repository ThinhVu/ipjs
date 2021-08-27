/**
 * @implements iEffect
 */
export default class Tiktok {
  /**
   * @param {Number} offset
   */
  constructor(offset = 3) {
    this._offset = offset
  }

  apply(img) {
    let w = img.width
    let h = img.height
    let offset = this._offset
    let w1 = w - offset
    let px
    for(let row=0; row<h; row++) {
      for (let col=offset; col<w1; col++) {
        px = img.px(row, col)
        img.px(row, col - offset).b = px.b
        px.r = img.px(row, col + offset).r
      }
    }
  }
}

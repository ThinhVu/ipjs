/**
 * @interface iEffectiveZone
 */

/**
 * @property iEffectiveZone#x
 * @property iEffectiveZone#y
 * @property iEffectiveZone#width
 * @property iEffectiveZone#height
 */


/**
 * @implements iEffect
 */
export default class Mosaic {
  /**
   *
   * @param {{x: number, width: number, y: number, height: number}} effectiveZone
   * @param {Number} size
   */
  constructor(effectiveZone, size) {
    this._left = Math.max(effectiveZone.x, 0)
    this._top = Math.max(effectiveZone.y, 0)
    this._width = Math.max(effectiveZone.width, 0)
    this._height = Math.max(effectiveZone.height, 0)
    if (size < 1)
      throw "Mosaic size must greater than 1"
    this._size = size
  }

  apply(img) {
    let w = img.width
    let h = img.height
    // left/top corner
    if (this._left > w) this._left = w
    if (this._top > h) this._top = h
    // area
    if (this._left + this._width > w) this._width = w - this._left
    if (this._top + this._height > h) this._height = h - this._top

    let col = this._left, row = this._top
    let endCol = col + this._width, endRow = row + this._height
    let nextX = 0, nextY = 0
    let remainX =0, remainY = 0
    while(row < endRow) {
      nextY = row + this._size
      remainY = nextY < endRow ? this._size : endRow - row;
      while(col < endCol) {
        nextX = col + this._size
        remainX = nextX < endCol ? this._size : endCol - col;
        this._applyForZone(img, { x: col, y: row, width: remainX, height: remainY })
        col += remainX
      }
      col = this._left
      row += remainY
    }
  }

  /**
   *
   * @param {Pixmap} img
   * @param {iEffectiveZone} zone
   * @private
   */
  _applyForZone(img, zone) {
    let endCol = zone.x + zone.width
    let endRow = zone.y + zone.height
    let totalPixel = zone.width * zone.height
    let r=0, g=0, b=0
    let px
    for (let row = zone.y; row < endRow; ++row) {
      for (let col = zone.x; col < endCol; ++col) {
        px = img.px(row, col)
        r += px.r
        g += px.g
        b += px.b
      }
    }

    let pxMean = {
      r: Math.floor(r / totalPixel),
      g: Math.floor(g / totalPixel),
      b: Math.floor(b / totalPixel)
    }

    for(let row = zone.y; row < endRow; ++row) {
      for (let col = zone.x; col < endCol; ++col) {
        px = img.px(row, col)
        px.r = pxMean.r
        px.g = pxMean.g
        px.b = pxMean.b
      }
    }
  }
}

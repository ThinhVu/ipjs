const colorIndex = { r: 0, g: 1, b: 2, a: 3 }

/**
 * @class
 */
export default class Pixmap {
  /**
   * Convert img element to pixmap
   * @param {ImageData | HTMLImageElement} img
   */
  constructor(img) {
    let imgData
    if (img instanceof HTMLImageElement) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext("2d")
      let w = canvas.width = img.width
      let h = canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      imgData = ctx.getImageData(0, 0, w, h)
      ctx = null
      canvas = null
    } else if (img instanceof ImageData) {
      imgData = img
    }
    this._width = imgData.width
    this._height = imgData.height
    this._data = imgData.data
    this.imageData = imgData
  }

  /**
   * Get pixel at row, col
   * @param {Number} rowIndex
   * @param {Number} colIndex
   * @return {Proxy<Pixel>}
   */
  px(rowIndex, colIndex) {
    return this.pxI(rowIndex * this._width + colIndex)
  }

  /**
   * Get Pixel at position i
   * @param {Number} i index of pixel in 1-dimension array
   * @return {Proxy<Pixel>}
   */
  pxI(i) {
    let t = this
    const redBytePosition = (i * 4 /*bpp*/)
    return new Proxy({}, {
      get: (target, p) => {
        return t._data[redBytePosition + colorIndex[p]]
      },
      set: (target, p, value) => {
        t._data[redBytePosition + colorIndex[p]] = Math.min(Math.max(value, 0), 255)
        return true
      }
    })
  }

  /**
   * Loop through all pixels the execute handlePixel function for this pixel
   * @param {Function} handlePx
   */
  each(handlePx) {
    for(let row=0; row<this._height; ++row) {
      for (let col=0; col<this._width; ++col) {
        handlePx(this.px(row, col))
      }
    }
  }

  /**
   * Return image width
   * @return {Number}
   */
  get width() {
    return this._width
  }

  /**
   * return image height
   * @return {Number}
   */
  get height() {
    return this._height
  }
}

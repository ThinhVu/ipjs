const colorIndex = { r: 0, g: 1, b: 2, a: 3 }

/**
 * @class
 */
export default class Pixmap {
  /**
   * Convert img element to pixmap
   * @param {ImageData} imgData
   */
  constructor(imgData) {
    this._width = imgData.width
    this._height = imgData.height
    this._data = imgData.data
  }

  /**
   * @param {Number} dataIndex
   * @return {{set: set, get: (function(): number)}}
   * @private
   */
  _createSetGetForColorChannelAt(dataIndex) {
    return {
      get: () => this._data[dataIndex],
      set: v => {
        if (v < 0)
          v = 0
        if (v > 255)
          v = 255
        this._data[dataIndex] = v
      },
    }
  }

  px(row, col) {
    // TODO: increase performance
    return this.pxI(row * this._width + col)
  }

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

  each(handlePx) {
    for(let row=0; row<this._height; ++row) {
      for (let col=0; col<this._width; ++col) {
        handlePx(this.px(row, col))
      }
    }
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }
}

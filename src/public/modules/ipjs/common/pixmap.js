import Channel from '../common/channel.js'

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

  /**
   * Get pixel at provided position
   * @param {Number} row
   * @param {Number} col
   * @return {Pixel}
   */
  px(row, col) {
    // TODO: increase performance
    return this.pxI(row * this._width + col)
  }

  pxI(i) {
    let pixel = {}
    const redBytePosition = (i * 4 /*bpp*/)
    Object.defineProperty(pixel, 'r', this._createSetGetForColorChannelAt(redBytePosition + Channel.R))
    Object.defineProperty(pixel, 'g', this._createSetGetForColorChannelAt(redBytePosition + Channel.G))
    Object.defineProperty(pixel, 'b', this._createSetGetForColorChannelAt(redBytePosition + Channel.B))
    Object.defineProperty(pixel, 'a', this._createSetGetForColorChannelAt(redBytePosition + Channel.A))
    return pixel
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }
}

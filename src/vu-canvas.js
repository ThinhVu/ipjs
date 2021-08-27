/**
 * @class
 */
export default class VuCanvas {
  /**
   * @type {HTMLCanvasElement}
   */
  canvas = null
  // layers = []

  constructor(canvas) {
    this.canvas = canvas
  }

  get width() {
    return this.canvas.width
  }
  get height() {
    return this.canvas.height
  }

  resize({ left, top, right, bottom }) {
    let w = this.width
    let h = this.height
    let newWidth = w
    let newHeight = h
    if (left) newWidth += w
    if (top) newHeight += h
    if (right) newWidth += w
    if (bottom) newHeight += h

    let ctx = this.canvas.getContext("2d")
    const imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    this.canvas.width = newWidth
    this.canvas.height = newHeight
    ctx.putImageData(imgData, left ? w : 0, top ? h : 0)
  }

  crop({ left, top, right, bottom }) {
    let ctx = this.canvas.getContext("2d")
    const imgData = ctx.getImageData(left, top, right - left, bottom - top)
    this.canvas.width = right - left
    this.canvas.height = bottom - top
    ctx.putImageData(imgData, 0, 0)
  }

  addLayer(newLayer) {

  }
}

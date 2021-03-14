export default class Histogram {
  /**
   * @param {Pixmap} img
   */
  constructor(img) {
    const red = Array(255).fill(0)
    const green = Array(255).fill(0)
    const blue = Array(255).fill(0)
    let px
    for(let row = 0; row < img.height; ++row) {
      for (let col = 0; col < img.width; ++col) {
        px = img.px(row, col)
        red[px.r]++
        green[px.g]++
        blue[px.b]++
      }
    }

    this.red = red
    this.green = green
    this.blue = blue
  }
}

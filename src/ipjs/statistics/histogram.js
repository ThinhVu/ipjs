export default class Histogram {
  red = []
  green = []
  blue = []
  /**
   * @param {Pixmap} img
   */
  constructor(img) {
    const red = Array(255).fill(0)
    const green = Array(255).fill(0)
    const blue = Array(255).fill(0)
    img.each(px => {
      red[px.r]++
      green[px.g]++
      blue[px.b]++
    })
    this.red = red
    this.green = green
    this.blue = blue
  }
}

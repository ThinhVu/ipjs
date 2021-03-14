/**
 * @implements iEffect
 */
export default class Invert {
  apply(img) {
    let px
    for(let col = 0; col < img.width; col++) {
      for(let row = 0; row < img.height; row++) {
        px = img.px(row, col)
        px.r = 255 - px.r
        px.g = 255 - px.g
        px.b = 255 - px.b
      }
    }
  }
}

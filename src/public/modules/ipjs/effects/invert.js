/**
 * @implements iEffect
 */
export default class Invert {
  apply(img) {
    img.each(px => {
      px.r = 255 - px.r
      px.g = 255 - px.g
      px.b = 255 - px.b
    })
  }
}

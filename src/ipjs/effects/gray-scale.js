export const getGayScale = (px) => Math.floor(0.299 * px.r + 0.587 * px.g + 0.114 * px.b)

/***
 * @implements iEffect
 */
export default class GrayScale {
  apply(img) {
    img.each(px => px.r = px.g = px.b = getGayScale(px))
  }
}

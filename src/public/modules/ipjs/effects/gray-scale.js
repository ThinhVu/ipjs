/***
 * @implements iEffect
 */
export default class GrayScale {
  apply(img) {
    let h = img.height
    let w = img.width
    let px;
    let grayscale;
    for(let row = 0; row < h; row ++) {
      for (let col = 0; col < w; col ++) {
        px = img.px(row, col)
        grayscale = Math.floor(0.299 * px.r + 0.587 * px.g + 0.114 * px.b);
        px.r = grayscale
        px.g = grayscale
        px.b = grayscale
      }
    }
  }
}

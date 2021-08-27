/**
 * @enum
 * For convenience, value of R,G,B,A, will be assign corresponding to
 * it's position in ImageData.data
 *
 * For example: set norm
 *  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 *  const data = imageData.data;
 *  for (var i = 0; i < data.length; i += 4) {
 *     var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
 *     data[i]     = avg; // red
 *     data[i + 1] = avg; // green
 *     data[i + 2] = avg; // blue
 *     data[i + 3] = avg; // alpha
 *  }
 */
export default {
  R: 0,
  G: 1,
  B: 2,
  A: 3,
  RGB: 4 // just added as an external
}

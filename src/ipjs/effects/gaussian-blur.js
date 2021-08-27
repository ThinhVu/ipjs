/**
 * @implements iEffect
 */
export default class GaussianBlur {
  constructor(radial = 2) {
    this.radial = radial
  }

  apply(img) {
    let len = img.width * img.height

    this._width = img.width
    this._height = img.height
    let alpha = Array(len).fill(0)
    let red = Array(len).fill(0)
    let green = Array(len).fill(0)
    let blue = Array(len).fill(0)

    let px
    for (let i = 0; i < len; i++) {
      px = img.pxI(i)
      alpha[i] = px.a
      red[i] = px.r
      green[i] = px.g
      blue[i] = px.b
    }

    let newAlpha = Array(len).fill(0)
    let newRed = Array(len).fill(0)
    let newGreen = Array(len).fill(0)
    let newBlue = Array(len).fill(0)

    this._gaussBlur_4(alpha, newAlpha, this.radial)
    this._gaussBlur_4(red, newRed, this.radial)
    this._gaussBlur_4(green, newGreen, this.radial)
    this._gaussBlur_4(blue, newBlue, this.radial)

    for (let i=0; i < len; ++i) {
      newAlpha[i] = Math.min(Math.max(0, newAlpha[i]), 255)
      newRed[i] = Math.min(Math.max(0, newRed[i]), 255)
      newGreen[i] = Math.min(Math.max(0, newGreen[i]), 255)
      newBlue[i] = Math.min(Math.max(0, newBlue[i]), 255)

      let px = img.pxI(i)
      px.a = newAlpha[i]
      px.r = newRed[i]
      px.g = newGreen[i]
      px.b = newBlue[i]
    }
  }

  /**
   *
   * @param {Array<Number>} src
   * @param {Array<Number>} dst
   * @param {Number} r
   * @private
   */
  _gaussBlur_4(src, dst, r) {
    let bxs = this._boxesForGauss(r, 3)
    this._boxBlur_4(src, dst, this._width, this._height, (bxs[0] - 1)/2)
    this._boxBlur_4(dst, src, this._width, this._height, (bxs[1] - 1)/2)
    this._boxBlur_4(src, dst, this._width, this._height, (bxs[2] - 1)/2)
  }

  /**
   *
   * @param {Number} sigma
   * @param {Number} n
   * @private
   */
  _boxesForGauss(sigma, n) {
    let wl = Math.floor(Math.sqrt((12 * sigma * sigma / n) + 1))
    if (wl % 2 === 0)
      wl--;
    let wu = wl + 2;

    let m = Math.round(12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
    let sizes = []
    for (let i=0; i<n; ++i)
      sizes.push(i < m ? wl : wu)
    return sizes
  }

  /**
   *
   * @param {Array<Number>} src
   * @param {Array<Number>} dest
   * @param {Number} w
   * @param {Number} h
   * @param {Number} r
   * @private
   */
  _boxBlur_4(src, dst, w, h, r) {
    for (let i=0; i < src.length; ++i)
      dst[i] = src[i];
    this._boxBlurH_4(dst, src, w, h, r)
    this._boxBlurT_4(src, dst, w, h, r)
  }

  _boxBlurH_4(src, dst, w, h, r) {
    let iar = 1 / (r + r + 1)
    for(let i=0; i<h; ++i) {
      let ti = i * w;
      let li = ti;
      let ri = ti + r;
      let fv = src[ti]
      let lv = src[ti + w - 1]
      let val = (r +1) * fv
      for(let j=0; j<r; ++j)
        val += src[ti + j]
      for (let j=0; j<= r; j++) {
        val += src[ri++] - fv
        dst[ti++] = Math.round(val * iar)
      }
      for(let j= r + 1; j < w - r; j++) {
        val += src[ri++] - dst[li++]
        dst[ti++] = Math.round(val * iar)
      }
      for (let j = w -r; j < w; j++) {
        val += lv - src[li++]
        dst[ti++] = Math.round(val * iar)
      }
    }
  }
  _boxBlurT_4(src, dst, w, h ,r) {
    let iar = 1 / (r + r + 1)
    for (let i=0; i<w; ++i) {
      let ti = i;
      let li = ti;
      let ri = ti + r * w
      let fv = src[ti]
      let lv = src[ti + w * (h-1)]
      let val = (r+1) * fv
      for(let j=0;j < r; ++j)
        val += src[ti + j * w]
      for (let j=0; j <= r; j++) {
        val += src[ri] - fv
        dst[ti] = Math.round(val * iar)
        ri += w
        ti += w
      }
      for (let j = r + 1; j < h - r; j++) {
        val += src[ri] - src[li]
        dst[ti] = Math.round(val * iar)
        li += w
        ri += w
        ti += w
      }
      for(let j= h - r; j <h; j++) {
        val += lv - src[li]
        dst[ti] = Math.round(val * iar)
        li += w
        ti += w
      }
    }
  }
}

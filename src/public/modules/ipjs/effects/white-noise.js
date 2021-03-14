/**
 * @implements iEffect
 */
export default class WhiteNoise {
  /**
   *
   * @param {Number} noisePercentage
   */
  constructor(noisePercentage) {
    if (0 <= noisePercentage && noisePercentage <= 100)
      this._noisePercentage = noisePercentage
    else
      throw "Invalid noise percentage"
    this._noise = []
    this._noiseCtr = 0
  }

  apply(img) {
    let w = img.width
    let h = img.height
    this._initNoise(w * h)
    let px
    for(let row=0; row < h; ++row) {
      for (let col=0; col < w; ++col) {
        if (this._shouldMakeNoise()) {
          px = img.px(row, col)
          px.r = Math.max(px.r + 30, 255)
          px.g = Math.max(px.g + 30, 255)
          px.b = Math.max(px.b + 30, 255)
        }
      }
    }
  }

  _initNoise(pixel) {
    let noisePixel = this._noisePercentage * pixel / 100
    let unnoisePixel = pixel - noisePixel
    this._noise = []
    for(let i=0;i<noisePixel; ++i)
      this._noise.push(true)
    for(let i=0; i<unnoisePixel; ++i)
      this._noise.push(false)
    this._shuffle()
  }

  _shuffle() {
    let noiseLen = this._noise.length
    for(let i=0; i < noiseLen; ++i) {
      let j = this._getRandomArbitrary(i, noiseLen)
      let v = this._noise[i]
      this._noise[i] = this._noise[j]
      this._noise[j] = v
    }
  }

  _shouldMakeNoise() {
    if (this._noiseCtr === this._noise.length) {
      this._shuffle()
      this._noiseCtr = 0
    }
    return this._noise[this._noiseCtr++]
  }

  _getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

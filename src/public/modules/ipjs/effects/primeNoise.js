const primeNumbers = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251]
const isPrime = {}
for(let prime of primeNumbers) {
  isPrime[prime] = true
}

/**
 * @implements iEffect
 */
export default class PrimeNoise {
  apply(img) {
    let px
    let w = img.width
    let h = img.height
    for(let row = 0; row < h; ++row) {
      for (let col = 0; col < w; ++col) {
        px = img.px(row, col)
        if (isPrime[px.r]) px.r = 255
        if (isPrime[px.g]) px.g = 255
        if (isPrime[px.b]) px.b = 255
      }
    }
  }
}

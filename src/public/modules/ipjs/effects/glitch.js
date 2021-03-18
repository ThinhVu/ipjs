/**
 * @implements iEffect
 */
export default class Glitch {
  constructor() {
  }

  _buildGlitches(height) {
    const glitches = []
    let row = 0
    while(row < height) {
      const glitchHeight = Math.min(Math.floor(Math.random() * 10 + 1), height - row)
      const distance = Math.floor(Math.random() * 10)
      const direction = Math.round(Math.random()) > 0 ? 'left' : 'right'
      glitches.push({
        rows: { start: row, end: row + glitchHeight },
        distance,
        direction
      })
      row += glitchHeight
      row += Math.floor(Math.random() * 5)
    }
    return glitches
  }


  apply(img) {
    console.log('_buildGlitches')
    const glitches = this._buildGlitches(img.height)
    console.log('_buildGlitches done')
    let pxDst
    let pxSrc
    for(let { rows, direction, distance } of glitches) {
        for(let row = rows.start; row < rows.end; ++row) {
          if (direction === 'left') {
            // RTL
            for(let col=distance, maxCol = img.width - distance; col < maxCol; ++col) {
              pxDst = img.px(row, col-distance)
              pxSrc = img.px(row, col)
              pxDst.r = pxSrc.r
              // pxDst.g = pxSrc.g
              // pxDst.b = pxSrc.b
            }
          } else {
            // LTF
            for(let col=img.width - distance - 1, minCol = distance; col > minCol; --col) {
              pxDst = img.px(row, col)
              pxSrc = img.px(row, col-distance)
              // pxDst.r = pxSrc.r
              pxDst.g = pxSrc.g
              // pxDst.b = pxSrc.b
            }
          }
        }
    }
  }
}

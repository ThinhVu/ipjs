/**
 *
 * @param {String} src
 * @return {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
  return new Promise(r => {
    const img = document.createElement("img")
    img.onload = () => r(img)
    img.src= src
  })
}

/**
 *
 * @param {String[]} imageSources
 * @return {Promise<HTMLImageElement[]>}
 */
export function loadImages(imageSources) {
  return Promise.all(imageSources.map(loadImage))
}

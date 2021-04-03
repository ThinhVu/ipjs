import {loadImages} from '../common/utils.js';

export default async function trans(imgSrcs, config) {
  const { duration, fps, transition, container } = config
  const containerEl = document.getElementById(container)
  const images = await loadImages(imgSrcs)
  let imageIndex = -1
  let nextImageIndex
  function run() {
    imageIndex++
    if (imageIndex === images.length - 1) {
      return
    } else {
      nextImageIndex = imageIndex + 1
    }
    transition(images[imageIndex], images[nextImageIndex], containerEl, { duration, fps }).then(() => setTimeout(run, 1000))
  }
  run()
}

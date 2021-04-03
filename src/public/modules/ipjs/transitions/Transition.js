import {loadImages} from '../common/utils.js';

export default async function ({ imageSources, container, transition, stayDuration, loop }) {
  const containerEl = document.getElementById(container)
  const images = await loadImages(imageSources)
  let imageIndex = -1
  let nextImageIndex

  function run() {
    imageIndex++
    if (imageIndex === images.length - 1) {
      if (loop) {
        nextImageIndex = 0
      } else {
        return
      }
    } else if (imageIndex === images.length) {
      imageIndex = 0;
      nextImageIndex = imageIndex + 1
    } else {
      nextImageIndex = imageIndex + 1
    }

    transition.run(
        images[imageIndex],
        images[nextImageIndex],
        containerEl
    ).then(() => setTimeout(run, stayDuration))
  }

  run()
}

import IPJs from './modules/ipjs/index.js';
import Pixmap from './modules/ipjs/common/pixmap.js';
import Invert from './modules/ipjs/effects/invert.js';
import Channel from './modules/ipjs/common/channel.js'
import Additive from './modules/ipjs/effects/additive.js';
import GrayScale from './modules/ipjs/effects/gray-scale.js';

const api = (() => {
  window.URL = window.URL || window.webkitURL;

  function openUploadFileDialog(options = { multiple: false, mimeType: '*/*' }) {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = options.mimeType
      input.multiple = options.multiple
      input.addEventListener('change', async e => await resolve(e.target.files));
      document.body.appendChild(input)
      input.style.display = 'none'
      input.click()
      input.parentNode.removeChild(input)
    })
  }

  function createImageFrom(url) {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image)
      image.src = url;
    })
  }

  async function loadImage() {
    const images = []
    const files = await openUploadFileDialog({ mimeType: 'image/*', multiple: true })
    for(let file of files) {
      const imageURL = window.URL.createObjectURL(file);
      const image = await createImageFrom(imageURL);
      images.push(image)
    }
    return images
  }

  return {
    loadImage
  }
})()

const images = []

export async function loadImages() {
  images.push.apply(images, await api.loadImage())
  const canvas = document.getElementById('canvas')
  const image = images[0]
  console.log(`${image.width}x${image.height}`)
  canvas.width  = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  processImage(imageData)
  context.putImageData(imageData, 0, 0)
}

function processImage(imageData) {
  const pixmap = new Pixmap(imageData)
  const ipjs = new IPJs()
  // ipjs.add(new Additive(Channel.R, 255))
  ipjs.add(new GrayScale())
  ipjs.process(pixmap)
}


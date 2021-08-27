// https://motionarray.com/after-effects-templates/modern-slide-transitions-746045

import IPJs from '../index.js';
import GaussianBlur from '../effects/gaussian-blur.js';
import Pixmap from '../common/pixmap.js';
import easing from './easing.js'
import Additive from '../effects/additive.js';
const ipJs = new IPJs()
ipJs.add(new GaussianBlur(10))
ipJs.add(new Additive([{ channel: 4, value: -20 }]))

function makeImage(img, customImage) {
  return new Promise(resolve => {
    const w = img.width
    const h = img.height
    const c = document.createElement("canvas")
    c.width = w
    c.height = h
    const ctx = c.getContext("2d")
    customImage(ctx, w, h)
    const outImg = document.createElement("img")
    outImg.onload = () => resolve(outImg)
    outImg.src = c.toDataURL("image/bmp")
  })
}
function makeGradientImg(img) {
  return makeImage(img, (ctx, w, h) => {
    const gradient = ctx.createLinearGradient(0,h, w, 0);
    gradient.addColorStop(0, '#2669B7');
    gradient.addColorStop(1, '#98B5FE');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  })
}
function makeBlurImage(img) {
  return makeImage(img, (ctx, w, h) => {
    ctx.scale(2,2)
    ctx.drawImage(img, -w/2 ,-h/2, w * 2, h * 2)
    const imgData = ctx.getImageData(0, 0, w, h)
    ipJs.process(new Pixmap(imgData))
    ctx.putImageData(imgData, 0, 0)
  })
}

const layers = [null /*current image*/, null /*gradient color*/, null /*gaussianblur*/, null/*next image*/]
layers.eachCtx = action => [1,2,3].forEach(i => action(layers[i].ctx)) // cause we only animate layer 1,2,3.
function createLayer(container, index) {
  const c = document.createElement('canvas')
  c.width = container.clientWidth
  c.height = container.clientHeight
  c.style = `position: absolute; top: 0; left: 0; z-index: ${index};`
  container.append(c)
  return {
    canvas: c,
    ctx: c.getContext("2d")
  }
}
function initLayersIfNeeded(container, w, h) {
  for(let i=0; i<4; ++i)
    if (!layers[i])
      layers[i] = createLayer(container, w, h, i)
}

// https://motionarray.com/browse/after-effects-templates/transitions
export default class ModernSlide {
  constructor({ transitionDuration, fps, origin, easing }) {
    this.transitionDuration =  transitionDuration
    this.fps = fps
    this.origin = origin || { x: 0, y: 0 }
    this.easing = easing || 'easeInSine'
  }

  async run(preImg, nextImg, container) {
    const _t = this
    const w = container.clientWidth
    const h = container.clientHeight
    initLayersIfNeeded(container)

    const gradientImg = await makeGradientImg(nextImg);
    const blurImg = await makeBlurImage(nextImg);

    // Draw the ellipse
    const makePaths = [
      (radius) => {
        const path = new Path2D()
        path.ellipse(_t.origin.x, _t.origin.y, radius, radius, 0, 0, 2 * Math.PI);
        path.lineTo(_t.origin.x, _t.origin.y)
        path.closePath()
        return path
      },
      (radius) => {
        const path = new Path2D()
        const xyRatio = w/h
        let y = Math.sqrt(Math.pow(radius, 2) / (Math.pow(xyRatio, 2) + 1))
        const x = xyRatio * y
        path.moveTo(0, 0)
        path.lineTo(0, h)
        path.lineTo(x, y)
        path.lineTo(w, 0)
        path.closePath()
        return path
      }
    ]

    const makePath = makePaths[1]

    const msPerStep = 1000 / _t.fps;
    const maxRadius = Math.sqrt(w * w + h * h)
    const totalStep = _t.transitionDuration / msPerStep;
    let currentStep = 0

    //
    let gradientRadius = 0;
    let blurRadius = 0;
    let radius = 0;

    return new Promise(resolve => {
      function anim() {
        currentStep++
        layers.eachCtx(ctx => ctx.save())

        gradientRadius = Math.round(maxRadius * easing[_t.easing](Math.min(currentStep, totalStep)/totalStep))
        layers[1].ctx.clip(makePath(gradientRadius), "nonzero")
        layers[1].ctx.drawImage(gradientImg, 0, 0)

        blurRadius = Math.round(maxRadius * easing[_t.easing](Math.max(currentStep - 10, 0)/totalStep))
        layers[2].ctx.clip(makePath(blurRadius), "evenodd")
        layers[2].ctx.drawImage(blurImg, 0, 0)

        radius = Math.round(maxRadius * easing[_t.easing](Math.max(currentStep - 20, 0)/totalStep))
        layers[3].ctx.clip(makePath(radius), "evenodd")
        layers[3].ctx.drawImage(nextImg, 0, 0)

        // remove clip
        layers.eachCtx(ctx => ctx.restore())

        if (currentStep < totalStep) {
          setTimeout(anim, msPerStep)
        } else {
          return resolve()
        }
      }

      layers[0].ctx.drawImage(preImg, 0, 0)
      layers.eachCtx(ctx => ctx.clearRect(0,0,w,h))
      anim()
    })
  }
}

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
    gradient.addColorStop(0, '#efff05');
    gradient.addColorStop(1, '#a5fe98');
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

let baseCanvas, gradientCanvas, blurCanvas, canvas
let baseCtx, gradientCtx, blurCtx, ctx

function initCanvas(container, zIndex) {
  const c = document.createElement('canvas')
  c.width = container.clientWidth
  c.height = container.clientHeight
  c.style = `position: absolute; top: 0; left: 0; z-index: ${zIndex};`
  container.append(c)
  return [c, c.getContext("2d")]
}
function initCanvasIfNeeded(container, w, h) {
  if (baseCanvas == null)
    [baseCanvas, baseCtx] = initCanvas(container, w, h, 0)

  if (gradientCanvas == null)
    [gradientCanvas, gradientCtx] = initCanvas(container, w, h, 1)

  if (blurCanvas == null)
    [blurCanvas, blurCtx] = initCanvas(container, w, h, 2)

  if (canvas == null)
    [canvas, ctx] = initCanvas(container, w, h, 3)
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
    initCanvasIfNeeded(container)

    const gradientImg = await makeGradientImg(nextImg);
    const blurImg = await makeBlurImage(nextImg);

    // Draw the ellipse
    function makePath(radius) {
      const path = new Path2D()
      path.ellipse(_t.origin.x, _t.origin.y, radius, radius, 0, 0, 2 * Math.PI);
      path.lineTo(_t.origin.x, _t.origin.y)
      path.closePath()
      return path
    }

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
        ctx.save()
        blurCtx.save()
        gradientCtx.save()

        gradientRadius = Math.round(maxRadius * easing[_t.easing](Math.min(currentStep, totalStep)/totalStep))
        gradientCtx.clip(makePath(gradientRadius), "nonzero")
        gradientCtx.drawImage(gradientImg, 0, 0)

        blurRadius = Math.round(maxRadius * easing[_t.easing](Math.max(currentStep - 10, 0)/totalStep))
        blurCtx.clip(makePath(blurRadius), "evenodd")
        blurCtx.drawImage(blurImg, 0, 0)

        radius = Math.round(maxRadius * easing[_t.easing](Math.max(currentStep - 20, 0)/totalStep))
        ctx.clip(makePath(radius), "evenodd")
        ctx.drawImage(nextImg, 0, 0)

        // remove clip
        ctx.restore()
        blurCtx.restore()
        gradientCtx.restore()

        if (currentStep < totalStep) {
          setTimeout(anim, msPerStep)
        } else {
          return resolve()
        }
      }

      baseCtx.drawImage(preImg, 0, 0)
      gradientCtx.clearRect(0,0,w,h)
      blurCtx.clearRect(0,0,w,h);
      ctx.clearRect(0,0,w,h);
      anim()
    })
  }
}

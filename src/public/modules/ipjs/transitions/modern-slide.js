import IPJs from '../index.js';
import GaussianBlur from '../effects/gaussian-blur.js';
import Pixmap from '../common/pixmap.js';
import anims from './anims.js'
import GrayScale from '../effects/gray-scale.js';
const ipJs = new IPJs()
ipJs.add(new GaussianBlur(4))
ipJs.add(new GrayScale())

function makeBlurImage(img) {
  return new Promise(resolve => {
    const w = img.width
    const h = img.height
    const c = document.createElement("canvas")
    c.width = w
    c.height = h
    const ctx = c.getContext("2d")
    ctx.drawImage(img, 0 ,0)
    const imgData = ctx.getImageData(0, 0, w, h)
    ipJs.process(new Pixmap(imgData))
    ctx.putImageData(imgData, 0, 0)
    const blurImg = document.createElement("img")
    blurImg.onload = () => resolve(blurImg)
    blurImg.src = c.toDataURL("image/bmp")
  })
}

let baseCanvas, blurCanvas, canvas
let baseCtx, blurCtx, ctx

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

  if (blurCanvas == null)
    [blurCanvas, blurCtx] = initCanvas(container, w, h, 1)

  if (canvas == null)
    [canvas, ctx] = initCanvas(container, w, h, 2)
}

// https://motionarray.com/browse/after-effects-templates/transitions
export default async function transition(preImg, nextImg, container, { duration, fps }) {
  const w = container.clientWidth
  const h = container.clientHeight
  initCanvasIfNeeded(container)

  const blurImg = await makeBlurImage(nextImg);

  // Draw the ellipse
  const origin = { x: 0, y: 0 }
  function makePath(radius) {
    const path = new Path2D()
    path.ellipse(origin.x, origin.y, radius, radius, 0, 0, 2 * Math.PI);
    path.lineTo(origin.x, origin.y)
    path.closePath()
    return path
  }

  const msPerStep = 1000 / fps;
  const maxRadius = Math.sqrt(w * w + h * h)
  const totalStep = duration / msPerStep;
  let currentStep = 0
  let radius = 0;
  let distance = 0;

  return new Promise(resolve => {
    function anim() {
      currentStep++
      ctx.save()
      blurCtx.save()
      radius = Math.round(maxRadius * anims.easeInOutQuart(currentStep/totalStep))
      distance = 100 * Math.round(Math.sin(currentStep/totalStep * Math.PI))
      blurCtx.clip(makePath(radius + distance), "evenodd")
      blurCtx.drawImage(blurImg, 0, 0)
      ctx.clip(makePath(radius), "evenodd")
      ctx.drawImage(nextImg, 0, 0)
      ctx.restore()
      blurCtx.restore()
      if (currentStep < totalStep) {
        setTimeout(anim, msPerStep)
      } else {
        return resolve()
      }
    }
    baseCtx.drawImage(preImg, 0, 0)
    anim()
  })
}

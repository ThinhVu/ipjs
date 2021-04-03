import IPJs from '../index.js';
import GaussianBlur from '../effects/gaussian-blur.js';
import Pixmap from '../common/pixmap.js';
import GrayScale from '../effects/gray-scale.js';

function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

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
    const ipJs = new IPJs()
    ipJs.add(new GrayScale())
    ipJs.add(new GaussianBlur(10))
    ipJs.process(new Pixmap(imgData))
    ctx.putImageData(imgData, 0, 0)
    const blurImg = document.createElement("img")
    blurImg.width = w
    blurImg.height = h
    blurImg.onload = () => resolve(blurImg)
    blurImg.src = c.toDataURL("image/bmp")
  })
}

// https://motionarray.com/browse/after-effects-templates/transitions
export default async function transition(preImg, nextImg, baseCanvas, blurCanvas, canvas, effect, config) {
  const w = preImg.width
  const h = preImg.height
  const baseCtx = baseCanvas.getContext("2d")
  const blurCtx =  blurCanvas.getContext("2d")
  const ctx = canvas.getContext("2d")
  const blurImg = await makeBlurImage(nextImg);

  // Draw the ellipse
  const origin = { x: 0, y: h }
  function makePath(radius, v) {
    const path = new Path2D()
    path.ellipse(origin.x, origin.y, radius * v, radius * v, 0, Math.PI * 1.5, 2 * Math.PI);
    path.lineTo(origin.x, origin.y)
    path.closePath()
    return path
  }

  const duration = 5000;
  const fps = 30;

  const msPerStep = 1000 / fps;
  const maxRadius = Math.sqrt(w * w + h * h)
  const totalStep = duration / msPerStep;
  let currentStep = 0
  let radius = 0;
  function anim() {
    currentStep++
    ctx.save()
    blurCtx.save()
    radius = Math.round(maxRadius * easeInOutQuart(currentStep/totalStep))
    console.log(radius)
    blurCtx.clip(makePath(radius, 2), "nonzero")
    blurCtx.drawImage(blurImg, 0, 0)
    ctx.clip(makePath(radius, 1), "nonzero")
    ctx.drawImage(nextImg, 0, 0)
    ctx.restore()
    blurCtx.restore()
    if (currentStep < totalStep) {
      setTimeout(anim, msPerStep)
    }
  }

  baseCtx.drawImage(preImg, 0, 0)
  anim()
  // ctx.ellipse(origin.x, origin.y, radius, radius, 0, Math.PI * 1.5, 2 * Math.PI);
  // ctx.lineTo(origin.x, origin.y)
  // ctx.lineTo(150, 100)
  // ctx.ellipse(100, 100, 50, 50, 0, 0, 1.5 * Math.PI, true);
  // ctx.lineTo(100, 0)

  // ctx.fillStyle = "red";
  // ctx.fill();
  // // ctx.clip("evenodd")
  // ctx.stroke();
}

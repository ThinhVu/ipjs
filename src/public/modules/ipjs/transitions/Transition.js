import IPJs from '../index.js';
import GaussianBlur from '../effects/gaussian-blur.js';
import Pixmap from '../common/pixmap.js';

export default function transition(preImg, nextImg, ctx, effect, config) {
  const w = preImg.width
  const h = preImg.height
  ctx.drawImage(preImg, 0, 0)
  ctx.save()

  const ipJs = new IPJs()
  ipJs.add(new GaussianBlur(4))

  // Draw the ellipse
  const origin = { x: 0, y: h }
  let radius = 100

  function anim() {
    radius += 50
    ctx.beginPath()
    ctx.ellipse(origin.x, origin.y, radius, radius, 0, Math.PI * 1.5, 2 * Math.PI);
    ctx.lineTo(origin.x, origin.y)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(nextImg, 0, 0)
    const imgData = ctx.getImageData(0, origin.y - radius, radius, radius)
    const pixmap = new Pixmap(imgData)
    ipJs.process(pixmap)
    ctx.putImageData(imgData, 0, origin.y - radius)
    ctx.restore()
    ctx.save()
    if (radius <= w * Math.sqrt(2)) {
      setTimeout(anim, 1000)
    }
  }

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

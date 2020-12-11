const watermark = {}

const setWatermark = (str, parentElement) => {
  const id = '1.23452384164.123412416'

  if (document.getElementById(id) !== null) {
    parentElement
      ? parentElement.removeChild(document.getElementById(id))
      : document.body.removeChild(document.getElementById(id))
  }

  // 创建一个画布
  const can = document.createElement('canvas')
  // 设置画布的长宽
  can.width = 300
  can.height = 150

  const cans = can.getContext('2d')
  // 旋转角度
  cans.rotate((-30 * Math.PI) / 180)
  cans.font = '18px Vedana'
  // 设置填充绘画的颜色、渐变或者模式
  cans.fillStyle = 'rgba(200, 200, 200, 0.20)'
  // 设置文本内容的当前对齐方式
  cans.textAlign = 'left'
  // 设置在绘制文本时使用的当前文本基线
  cans.textBaseline = 'bottom'
  // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  // cans.fillText(str, can.width / 8, can.height / 2)
  cans.fillText(str, 0, can.height / 1)

  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '10px'
  div.style.left = '0px'
  div.style.position = parentElement ? 'absolute' : 'fixed'
  div.style.zIndex = '100000'
  div.style.width = parentElement ? parentElement.clientWidth - 10 + 'px' : document.documentElement.clientWidth + 'px'
  div.style.height = '100%'
  // div.style.height = parentElement ? parentElement.clientHeight + 'px' : document.documentElement.clientHeight + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  if (parentElement && (parentElement.style.position !== 'relative' || parentElement.style.position !== 'absolute')) {
    parentElement.style.position = 'relative'
  }
  parentElement ? parentElement.appendChild(div) : document.body.appendChild(div)
  return id
}

// 该方法只允许调用一次
watermark.set = (str, parentElement) => {
  const id = setWatermark(str, parentElement)
  // setInterval(() => {
  //   if (document.getElementById(id) === null) {
  //     id = setWatermark(str, parentElement)
  //   }
  // }, 2000)
  window.onresize = () => {
    setWatermark(str, parentElement)
  }
}

export default watermark

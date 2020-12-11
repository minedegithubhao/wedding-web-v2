import Vue from 'vue'

/**
 * 实时时间转换指令，大于一个月则返回具体的年月日
 * @param { string } timeStamp - 时间 格式：年-月-日 时:分:秒 或 时间戳
 * @returns { string }
 */
function getFormatTime(timeStamp) {
  var dateTime = new Date(timeStamp)
  var no1new = dateTime.valueOf()
  var year = dateTime.getFullYear()
  var month = dateTime.getMonth() + 1
  var day = dateTime.getDate()
  var hour = dateTime.getHours()
  var minute = dateTime.getMinutes()
  var second = dateTime.getSeconds()
  var now = new Date()
  var nowNew = now.valueOf()
  var milliseconds = 0
  var timeSpanStr

  milliseconds = nowNew - no1new

  if (milliseconds <= 1000 * 60 * 1) {
    timeSpanStr = '刚刚'
  } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
  } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
  } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前'
  } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
    // timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    timeSpanStr = year + '-' + month + '-' + day
  } else {
    // timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    timeSpanStr = year + '-' + month + '-' + day
  }

  return timeSpanStr
}

Vue.directive('time', {
  bind: function (el, binding, vnode) {
    // bind中的vnode里面的key可以给设置一个随机数，这样每次都会更新虚拟节点。
    const num = parseInt(Math.random() * 1000)
    vnode.key = num
    el.innerHTML = getFormatTime(binding.value)
    // 每隔一分钟更新一次
    el.__timeout__ = setInterval(function () {
      el.innerHTML = getFormatTime(binding.value)
    }, 30000)
  },
  unbind: function (el) {
    clearInterval(el.__timeout__)
    delete el.__timeout__
  }
})

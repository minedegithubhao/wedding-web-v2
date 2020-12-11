/**
 *
 * @returns {string}
 */

export function createUuid() {
  const lut = []
  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16)
  }
  const d0 = (Math.random() * 0xffffffff) | 0
  const d1 = (Math.random() * 0xffffffff) | 0
  const d2 = (Math.random() * 0xffffffff) | 0
  const d3 = (Math.random() * 0xffffffff) | 0
  return (
    lut[d0 & 0xff] +
    lut[(d0 >> 8) & 0xff] +
    lut[(d0 >> 16) & 0xff] +
    lut[(d0 >> 24) & 0xff] +
    lut[d1 & 0xff] +
    lut[(d1 >> 8) & 0xff] +
    '-' +
    lut[((d1 >> 16) & 0x0f) | 0x40] +
    lut[(d1 >> 24) & 0xff] +
    lut[(d2 & 0x3f) | 0x80] +
    lut[(d2 >> 8) & 0xff] +
    '-' +
    lut[(d2 >> 16) & 0xff] +
    lut[(d2 >> 24) & 0xff] +
    lut[d3 & 0xff] +
    lut[(d3 >> 8) & 0xff] +
    lut[(d3 >> 16) & 0xff] +
    lut[(d3 >> 24) & 0xff]
  )
}

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () { }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function millsToTime(mills) {
  if (!mills) {
    return ''
  }
  const s = mills / 1000
  if (s < 60) {
    return s.toFixed(0) + ' 秒'
  }
  const m = s / 60
  if (m < 60) {
    return m.toFixed(0) + ' 分钟'
  }
  const h = m / 60
  if (h < 24) {
    return h.toFixed(0) + ' 小时'
  }
  const d = h / 24
  if (d < 30) {
    return d.toFixed(0) + ' 天'
  }
  const month = d / 30
  if (month < 12) {
    return month.toFixed(0) + ' 个月'
  }
  const year = month / 12
  return year.toFixed(0) + ' 年'
}

/*
  生成UUID, 指定长度和基数

*/
export function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (let i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (let i = 0; i < 64; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}
/**
 * 判断对象是否为数组
 * @param arr
 */
export function isArray(arr) {
  return arr && Object.prototype.toString.call(arr) === '[object Array]'
}
/**
 * 为当前url添加参数
 * @param uri 当前uri
 * @param key 参数名
 * @param value 参数值
 */
export function updateQueryStringParameter(uri, key, value) {
  if (!value || !key) {
    return uri
  }
  var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
  var separator = uri.indexOf('?') !== -1 ? '&' : '?'
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2')
  } else {
    return uri + separator + key + '=' + value
  }
}

/**
 * 实时时间转换指令，大于一个月则返回具体的年月日
 * @param { string } timeStamp - 时间 格式：年-月-日 时:分:秒 或 时间戳
 * @returns { string }
 */
export function getFormatTime(timeStamp) {
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
    timeSpanStr = Math.round(milliseconds / (1000 * 60)) + '分钟前'
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
/**
 * 下载文件
 */
export function resolveBlob(response) {
  const data = response.data
  if (!data) {
    return
  }
  const contentDisposition = response.headers['content-disposition']
  const fileName = decodeURIComponent(contentDisposition.substring(contentDisposition.indexOf('=') + 1))
  const url = window.URL.createObjectURL(new Blob([data]))
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.setAttribute('download', fileName)
  document.body.appendChild(a)
  // 点击下载
  a.click()
  // 下载完成移除元素
  document.body.removeChild(a)
  // 释放掉blob对象
  window.URL.revokeObjectURL(url)
}
/**
 * 字节B转化成KB，MB，GB
 */
export function formatByte(limit) {
  limit = parseInt(limit)
  let size = ''
  if (limit < 1024) {
    // 小于1KB, 则转化成B
    size = limit.toFixed(2) + 'B'
  } else if (limit < 1024 * 1024) {
    // 小于1MB, 则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 1024 * 1024 * 1024) {
    // 小于1GB, 则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  const sizeStr = size + '' // 转成字符串
  const index = sizeStr.indexOf('.') // 获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
  if (dou === '00') {
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}
/**
 * 设置sessionStorage属性
 * @param key 键名
 * @param value 值
 */
export function setSessionStorage(key, value) {
  if (!key) {
    console.log(new Error('存储sessionStorage的Key必须为非假值'))
    return
  }
  sessionStorage.setItem(key, JSON.stringify(value))
}
/**
 * 获取sessionStorage属性
 * @param key 键名
 * @param isJson 是否返回json格式
 */
export function getSessionStorage(key, isJson = false) {
  if (!key) {
    console.log(new Error('存储sessionStorage的Key必须为非假值'))
    return
  }
  const jsonStr = sessionStorage.getItem(key)
  return isJson ? jsonStr : JSON.parse(jsonStr)
}
/**
 * 获取sessionStorage属性
 * @param key 键名
 * @param isJson 是否返回json格式
 */
export function getAge(strAge) {
  if (!strAge) {
    return ''
  }
  const birArr = strAge.split('-')
  const birYear = parseInt(birArr[0])
  const birMonth = parseInt(birArr[1])
  const birDay = parseInt(birArr[2])

  const today = new Date()
  const nowYear = today.getFullYear()
  const nowMonth = today.getMonth() + 1 // 记得加1
  const nowDay = today.getDate()
  let returnAge = 0

  if (birArr == null) {
    return false
  };
  const d = new Date(birYear, birMonth - 1, birDay)
  if (d.getFullYear() === birYear && (d.getMonth() + 1) === birMonth && d.getDate() === birDay) {
    if (nowYear === birYear) {
      returnAge = 0
    } else {
      const ageDiff = nowYear - birYear
      if (ageDiff > 0) {
        if (nowMonth === birMonth) {
          const dayDiff = nowDay - birDay
          if (dayDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        } else {
          const monthDiff = nowMonth - birMonth
          if (monthDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        }
      } else {
        return '出生日期晚于今天，数据有误' // 返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return returnAge
  } else {
    return '输入的日期格式错误！'
  }
}

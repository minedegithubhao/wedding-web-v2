// 状态字典
// eslint-disable-next-line no-unused-vars
const statusDic = {
  '1': '正常',
  '0': '禁用'
}

export const keyToValue = (originData = [], fields = [], dic = {}) => {
  // 拷贝
  const data = JSON.parse(JSON.stringify(originData))
  data.forEach(origin => {
    fields.forEach(filed => {
      const k = origin[filed.name] + ''
      origin[filed.name] = k
      let v = k
      if (dic.has(k)) {
        v = dic.get(k)
      }
      if (filed.aliasName !== undefined) {
        origin[filed.aliasName] = v
      } else {
        origin[filed.name] = v
      }
    })
  })
  return data
}

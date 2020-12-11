/**
 * 构造树型结构数据
 * @param {*} source 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function treeData (source, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  const cloneData = JSON.parse(JSON.stringify(source))// 对源数据深度克隆
  return cloneData.filter(father => {
    const branchArr = cloneData.filter(child => father[id] === child[parentId])// 返回每一项的子级数组
    branchArr.length > 0 ? father[children] = branchArr : delete father[children]// 如果存在子级，则给父级添加一个children属性，并赋值
    return father[parentId] === rootId // 返回第一层
  })
}

/**
 * 构造树选择框树型结构数据
 * @param {*} source 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} name name字段 默认 'name'
 * @param {*} pid 父节点字段 默认 'pid'
 * @param {*} rootId 根Id 默认 0
 * @param {*} title 根名称 默认 '无'
 */
export function treeSelectData(
  source,
  isSelectParent = true,
  haveRoot = false,
  rootDisabled = false,
  id,
  name,
  pid,
  rootId = '0',
  title = '所有'
) {
  const data = haveRoot
    ? [
        {
          key: '',
          value: '',
          title: title,
          children: [],
          disabled: rootDisabled,
          isLeaf: rootDisabled
        }
      ]
    : []
  id = id || 'id'
  name = name || 'name'
  pid = pid || 'pid'
  buildTree(source, id, name, pid, data, rootId, isSelectParent)
  return data
}

function buildTree(list, id, name, pid, arr, parentId, isSelectParent) {
  let flag = true
  list.forEach(item => {
    if (item[pid] === parentId) {
      const child = {
        key: item[id],
        value: item[id] + '',
        title: item[name],
        children: []
      }
      const isLeaf = buildTree(list, id, name, pid, child.children, item[id], isSelectParent)
      if (!isLeaf && !isSelectParent) {
        child.disabled = true
      }
      child.isLeaf = isLeaf
      let needPush = true
      arr.forEach(item => {
        if (item.key === child.key) {
          needPush = false
        }
      })
      if (needPush) {
        flag = false
        arr.push(child)
      }
    }
  })
  return flag
}

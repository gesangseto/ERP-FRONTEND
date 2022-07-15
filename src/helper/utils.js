export const reformatMenu = (menu = Array, parent_url = '') => {
  let threeMenu = treeify(menu, 'sys_menu_id', 'sys_menu_parent_id')
  let _res = []
  for (const it of threeMenu) {
    let item = {
      name: it.sys_menu_name,
      to: parent_url + it.sys_menu_url,
      icon: it.sys_menu_icon,
    }
    if (it.children.length > 0) {
      item.items = reformatMenu(it.children, item.to)
      delete item.to
    }
    _res.push(item)
  }
  return _res
}

function treeify(list, idAttr, parentAttr, childrenAttr) {
  if (!idAttr) idAttr = 'id'
  if (!parentAttr) parentAttr = 'parent'
  if (!childrenAttr) childrenAttr = 'children'

  var treeList = []
  var lookup = {}
  list.forEach(function (obj) {
    lookup[obj[idAttr]] = obj
    obj[childrenAttr] = []
  })
  list.forEach(function (obj) {
    if (obj[parentAttr] != null) {
      if (lookup[obj[parentAttr]] !== undefined) {
        lookup[obj[parentAttr]][childrenAttr].push(obj)
      } else {
        //console.log('Missing Parent Data: ' + obj[parentAttr]);
        treeList.push(obj)
      }
    } else {
      treeList.push(obj)
    }
  })
  return treeList
}

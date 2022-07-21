import { icon } from "../constants";

export const makeId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const makeString = (length) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const findOnArr = ({ str, key = "id", array = Array }) => {
  let result = array.findIndex((x) => x[key] === str);
  return result;
};

export const mergeArray = (a, b, prop) => {
  var reduced = a.filter(
    (aitem) => !b.find((bitem) => aitem[prop] === bitem[prop])
  );
  return reduced.concat(b);
};

export const haveRole = (item) => {
  if (
    item.flag_create == 0 &&
    item.flag_delete == 0 &&
    item.flag_download == 0 &&
    item.flag_print == 0 &&
    item.flag_read == 0 &&
    item.flag_update == 0
  ) {
    return false;
  }
  return true;
};

export const reformatMenu = (menu = Array) => {
  let threeMenu = treeify(menu, "sys_menu_id", "sys_menu_parent_id");
  let _res = [];
  for (const it of threeMenu) {
    let item = {
      key: it.sys_menu_id,
      label: it.sys_menu_name,
      to: it.sys_menu_url,
      icon: icon[it.sys_menu_icon] ?? null,
    };
    if (it.children.length > 0) {
      item.children = reformatMenu(it.children);
      delete item.to;
    }
    if (!haveRole(it) && it.children.length == 0) {
      console.log("Punya", it);
    } else {
      _res.push(item);
    }
  }

  let newMenu = [];
  _res.forEach(function (obj) {
    if (obj.hasOwnProperty("children") && obj.children.length > 0) {
      newMenu.push(obj);
    } else if (obj.hasOwnProperty("to")) {
      newMenu.push(obj);
    }
  });
  return newMenu;
};

export const groupBy = (array = Array, key) => {
  return array.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const treeify = (list, idAttr, parentAttr, childrenAttr) => {
  if (!idAttr) idAttr = "id";
  if (!parentAttr) parentAttr = "parent";
  if (!childrenAttr) childrenAttr = "children";

  var treeList = [];
  var lookup = {};
  list.forEach(function (obj) {
    lookup[obj[idAttr]] = obj;
    obj[childrenAttr] = [];
  });
  list.forEach(function (obj) {
    if (obj[parentAttr] != null) {
      if (lookup[obj[parentAttr]] !== undefined) {
        lookup[obj[parentAttr]][childrenAttr].push(obj);
      } else {
        //console.log('Missing Parent Data: ' + obj[parentAttr]);
        treeList.push(obj);
      }
    } else {
      treeList.push(obj);
    }
  });
  return treeList;
};

export const canApprove = (approval) => {
  let profile = JSON.parse(localStorage.getItem("profile"));
  try {
    if (
      approval.is_approve == null &&
      (approval.approval_current_user_id == profile.user_id ||
        0 == profile.user_id)
    ) {
      return approval;
    }
    return false;
  } catch (e) {
    return false;
  }
};

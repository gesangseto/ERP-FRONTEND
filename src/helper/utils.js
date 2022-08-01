import { icon } from "../constants";
import { matchRoutes, useLocation } from "react-router-dom";
import routes from "../routes";

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
    } else {
      delete item.children;
    }

    _res.push(item);
  }
  return _res;
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
        treeList.push(obj);
      }
    } else {
      treeList.push(obj);
    }
  });
  return treeList;
};

export const removeEmptyChild = (arr = Array, key = String) => {
  let _data = [];
  for (const it of arr) {
    if (Array.isArray(it[key]) && it[key].length == 0) {
      delete it[key];
    } else {
      it[key] = removeEmptyChild(it[key], "children");
    }
    _data.push(it);
  }
  return _data;
};

export const removeEmptyObject = (arr = Array, key = String, key2 = String) => {
  let _data = [];
  for (const it of arr) {
    if (key && key2) {
      if (it[key] && it[key2]) {
        _data.push(it);
      }
    } else if (key) {
      if (it[key]) {
        _data.push(it);
      }
    }
  }
  return _data;
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
export const makeOption = (data = Array, value = "id", label = "name") => {
  let _data = [];
  for (const it of data) {
    it.value = it[value];
    it.label = it[label];
    _data.push(it);
  }
  return _data;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

export const getRoute = () => {
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);
  return route;
};

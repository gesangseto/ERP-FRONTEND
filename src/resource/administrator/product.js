import { toast } from "react-toastify";
import $axios from "Api";

export const getProduct = async (property = {}, useAlert = true) => {
  if (property.hasOwnProperty("search")) {
    if (Array.isArray(property.search)) {
      property.search = JSON.stringify(property.search);
    }
  }
  var query_string = new URLSearchParams(property).toString();
  return new Promise((resolve) => {
    $axios
      .get(`/api/administrator/master/item?${query_string}`)
      .then((result) => {
        let _res = result.data;
        if (_res.error && useAlert) {
          toast.error(`${_res.message}`);
          return resolve(false);
        }
        return resolve(_res);
      })
      .catch((e) => {
        if (useAlert) toast.error(`${e.message}`);
        return resolve(false);
      });
  });
};

export const getProductVariant = async (property = {}, useAlert = true) => {
  if (property.hasOwnProperty("search")) {
    if (Array.isArray(property.search)) {
      property.search = JSON.stringify(property.search);
    }
  }
  var query_string = new URLSearchParams(property).toString();
  return new Promise((resolve) => {
    $axios
      .get(`/api/administrator/master/item-variant?${query_string}`)
      .then((result) => {
        let _res = result.data;
        if (_res.error && useAlert) {
          toast.error(`${_res.message}`);
          return resolve(false);
        }
        return resolve(_res);
      })
      .catch((e) => {
        if (useAlert) toast.error(`${e.message}`);
        return resolve(false);
      });
  });
};

export const insertProduct = async (body = {}, useAlert = true) => {
  return new Promise((resolve) => {
    $axios
      .put(`/api/administrator/master/item`, body)
      .then((result) => {
        let _res = result.data;
        if (_res.error && useAlert) {
          toast.error(`${_res.message}`);
          return resolve(false);
        }
        return resolve(_res);
      })
      .catch((e) => {
        if (useAlert) toast.error(`${e.message}`);
        return resolve(false);
      });
  });
};
export const updateProduct = async (body = {}, useAlert = true) => {
  return new Promise((resolve) => {
    $axios
      .post(`/api/administrator/master/item`, body)
      .then((result) => {
        let _res = result.data;
        if (_res.error && useAlert) {
          toast.error(`${_res.message}`);
          return resolve(false);
        }
        return resolve(_res);
      })
      .catch((e) => {
        if (useAlert) toast.error(`${e.message}`);
        return resolve(false);
      });
  });
};

export const deleteProduct = async (body = {}, useAlert = true) => {
  body = { data: body };
  return new Promise((resolve) => {
    $axios
      .delete(`/api/administrator/master/item`, body)
      .then((result) => {
        let _res = result.data;
        if (_res.error && useAlert) {
          toast.error(`${_res.message}`);
          return resolve(false);
        }
        return resolve(_res);
      })
      .catch((e) => {
        if (useAlert) toast.error(`${e.message}`);
        return resolve(false);
      });
  });
};

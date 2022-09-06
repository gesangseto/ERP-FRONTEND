import { toast } from "react-toastify";
import $axios from "Api";

export const getDestroy = async (property = {}, useAlert = true) => {
  if (property.hasOwnProperty("search")) {
    if (Array.isArray(property.search)) {
      property.search = JSON.stringify(property.search);
    }
  }
  var query_string = new URLSearchParams(property).toString();
  return new Promise((resolve) => {
    $axios
      .get(`/api/pos/transaction/destroy?${query_string}`)
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
export const getDestroyByUser = async (property = {}, useAlert = true) => {
  if (property.hasOwnProperty("search")) {
    if (Array.isArray(property.search)) {
      property.search = JSON.stringify(property.search);
    }
  }
  var query_string = new URLSearchParams(property).toString();
  return new Promise((resolve) => {
    $axios
      .get(`/api/pos/transaction/destroy/by-branch?${query_string}`)
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

export const insertDestroy = async (body = {}, useAlert = true) => {
  return new Promise((resolve) => {
    $axios
      .put(`/api/pos/transaction/destroy`, body)
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
export const updateDestroy = async (body = {}, useAlert = true) => {
  return new Promise((resolve) => {
    $axios
      .post(`/api/pos/transaction/destroy`, body)
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

import { toast } from "react-toastify";
import $axios from "Api";

export const getCashier = async (property = {}, useAlert = true) => {
  if (property.hasOwnProperty("search")) {
    if (Array.isArray(property.search)) {
      property.search = JSON.stringify(property.search);
    }
  }
  var query_string = new URLSearchParams(property).toString();
  return new Promise((resolve) => {
    $axios
      .get(`/api/transaction/pos/cashier?${query_string}`)
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

export const insertCashier = async (body = {}, useAlert = true) => {
  return new Promise((resolve) => {
    $axios
      .put(`/api/transaction/pos/cashier`, body)
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
export const updateCashier = async (body = {}, useAlert = true) => {
  return new Promise((resolve) => {
    $axios
      .post(`/api/transaction/pos/cashier`, body)
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

import { toast } from "react-toastify";
import $axios from "../Api";

export const getConfiguration = async (property = {}, useAlert = true) => {
  if (property.hasOwnProperty("search")) {
    if (Array.isArray(property.search)) {
      property.search = JSON.stringify(property.search);
    }
  }
  var query_string = new URLSearchParams(property).toString();
  return new Promise((resolve) => {
    $axios
      .get(`/api/configuration?${query_string}`)
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

export const updateConfiguration = async (body = {}, useAlert = true) => {
  return new Promise((resolve) => {
    $axios
      .post(`/api/configuration`, body)
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

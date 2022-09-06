import $axios from "Api";
import { toast } from "react-toastify";

export const menuUser = async (property = {}, useAlert = true) => {
  var query_string = new URLSearchParams(property).toString();
  return new Promise((resolve) => {
    $axios
      .get(`api/administrator/role/section?${query_string}`)
      .then((result) => {
        let _res = result.data;
        if (_res.error) {
          toast.error(_res.message);
          return resolve(false);
        }
        return resolve(_res.data);
      })
      .catch((e) => {
        console.log(e);
        return resolve(false);
      });
  });
};

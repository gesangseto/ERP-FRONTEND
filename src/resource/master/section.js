import { toast } from "react-toastify";
import $axios from "../../Api";

export const getSection = async (property = {}, useAlert = true) => {
  var query_string = new URLSearchParams(property).toString();
  return new Promise((resolve) => {
    $axios
      .get(`/api/master/user_section?${query_string}`)
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

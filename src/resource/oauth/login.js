import $axios from "../../Api";
import { toast } from "react-toastify";

export const loginUser = async (property = {}, useAlert = true) => {
  return new Promise((resolve) => {
    $axios
      .post(`api/login/user`, property)
      .then((result) => {
        let _res = result.data;
        if (_res.error) {
          toast.error(_res.message);
          return resolve(false);
        }
        localStorage.setItem("profile", JSON.stringify(_res.data[0]));
        return resolve(true);
      })
      .catch((e) => {
        console.log(e);
        return resolve(false);
      });
  });
};

import axios from "axios";
import { toast } from "react-toastify";

const $axios = axios.create();
$axios.defaults.timeout = 120000;
$axios.interceptors.request.use(
  async (config) => {
    NProgress.configure({ easing: "ease", speed: 500 });
    NProgress.start();
    let profile = localStorage.getItem("profile");
    config.baseURL = process.env.REACT_APP_API;
    if (profile) {
      profile = JSON.parse(profile);
      config.headers = {
        "Content-Type": "application/json",
        token: profile.token,
      };
    }
    return config;
  },
  (error) => {
    toast.error(`${error.message}`);
    return Promise.reject(error);
  }
);

$axios.interceptors.response.use(
  function (response) {
    NProgress.done();
    document.body.classList.remove("loading-indicator");
    let res = response.data;
    if (res && res.StatusCode && res.StatusCode == "401") {
      localStorage.clear();
      return Promise.resolve(response);
    }
    return Promise.resolve(response);
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default $axios;

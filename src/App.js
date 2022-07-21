import "antd/dist/antd.min.css";
import "antd-button-color/dist/css/style.css"; // or 'antd-button-color/dist/css/style.less'

import React, { Component, Suspense } from "react";
import {
  HashRouter,
  Route,
  Routes,
  useLocation,
  BrowserRouter,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
// Pages
const Login = React.lazy(() => import("./views/Login"));
const Page404 = React.lazy(() => import("./views/Page404"));

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
            <Route path="/404" name="LOST" element={<Page404 />} />
          </Routes>
          <ToastContainer />
        </Suspense>
      </HashRouter>
    );
  }
}

export default App;

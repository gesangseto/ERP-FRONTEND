import "antd/dist/antd.min.css";
import React, { Component, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
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

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
          <ToastContainer />
        </Suspense>
      </HashRouter>
    );
  }
}

export default App;

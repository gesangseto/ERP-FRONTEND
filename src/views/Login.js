import { Button, Checkbox, Form, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../resource/oauth/login";
import { menuUser } from "../resource/oauth/menu";

const Login = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    let _login = await loginUser(data);
    if (_login) {
      localStorage.setItem("profile", JSON.stringify(_login));
      let _menu = await menuUser({
        user_section_id: _login.user_section_id,
      });
      localStorage.setItem("menu", JSON.stringify(_menu));
      toast.success(`Welcome ${_login.user_name}`);
      navigate(`/dashboard`);
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img
            src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
            alt="Login"
          />
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={(e) => onSubmit(e)}
          onFinishFailed={onFinishFailed}
        >
          <p className="form-title">Welcome</p>
          <p>Login to the Dashboard</p>
          <Form.Item
            size="lg"
            name="user_name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="user_password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

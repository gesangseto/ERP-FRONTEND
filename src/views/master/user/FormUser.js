import { Button, Card, Form, Input, Select, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  getUser,
  insertUser,
  updateUser,
} from "../../../resource/administrator/user";
import { getDepartment, getSection } from "../../../resource/master";
import routes from "../../../routes";

const FormUser = () => {
  let { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
  const form = useRef(null);
  const [componentSize, setComponentSize] = useState("default");
  const [loading, setLoading] = useState(false);
  const [listDepart, setListDepart] = useState([]);
  const [listSect, setListSect] = useState([]);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_department_id: "",
    user_section_id: "",
    status: "",
  });

  useEffect(() => {
    console.log(route);
    if (id) {
      loadUser(id);
    }
    loadDepartment();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData, listSect]);

  const loadUser = async (id) => {
    let _data = await getUser({ user_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
    loadSection(_data.user_department_id);
  };

  const loadDepartment = async () => {
    let _data = await getDepartment();
    _data = _data.data;
    setListDepart([..._data]);
  };

  const loadSection = async (department_id) => {
    let param = {
      user_department_id: department_id ?? null,
    };
    let _data = await getSection(param);
    _data = _data.data;
    setListSect([..._data]);
  };

  const saveUser = async (param = Object) => {
    let _data;
    if (id) {
      param.user_id = id;
      _data = await updateUser(param);
    } else {
      _data = await insertUser(param);
    }
    if (_data) {
      toast.success("Success");
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.status = e.status ? 1 : 0;
    saveUser(e);
  };
  return (
    <Card title={route.name} style={{ textTransform: "capitalize" }}>
      <Form
        ref={form}
        defaultValue={formData}
        onFinish={(e) => handleSubmit(e)}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        size={componentSize}
      >
        <Form.Item
          initialValue={formData.user_name}
          label="Username"
          name="user_name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.user_email}
          label="Email"
          name="user_email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="user_password"
          rules={[
            {
              type: "password",
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={formData.user_department_id}
          label="Department"
          name="user_department_id"
          rules={[
            {
              required: true,
              message: "Please input your department!",
            },
          ]}
        >
          <Select onChange={(e) => loadSection(e)} disabled={type == "read"}>
            {listDepart.map((item, idx) => {
              return (
                <Select.Option key={idx} value={item.user_department_id}>
                  {item.user_department_name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          initialValue={formData.user_section_id}
          label="Section"
          name="user_section_id"
          rules={[
            {
              required: true,
              message: "Please input your section!",
            },
          ]}
        >
          <Select disabled={type == "read"}>
            {listSect.map((item, idx) => {
              return (
                <Select.Option key={idx} value={item.user_section_id}>
                  {item.user_section_name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          initialValue={formData.status}
          label="Status"
          valuePropName="checked"
          name="status"
        >
          <Switch disabled={type == "read"} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            disabled={type == "read"}
          >
            Save
          </Button>
          &nbsp;
          <Button type="danger" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormUser;

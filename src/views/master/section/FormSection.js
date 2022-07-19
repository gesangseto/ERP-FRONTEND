import { Button, Card, Form, Input, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
// import { updateDepartment } from "../../../resource/administrator/department";
import {
  getDepartment,
  insertDepartment,
  updateDepartment,
} from "../../../resource";
import routes from "../../../routes";

const FormSection = () => {
  let { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
  const form = useRef(null);
  const [componentSize, setComponentSize] = useState("default");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_department_id: "",
    user_department_name: "",
    user_department_code: "",
  });

  useEffect(() => {
    if (id) {
      loadFormData(id);
    }
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getDepartment({ user_department_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.user_department_id = id;
      _data = await updateDepartment(param);
    } else {
      _data = await insertDepartment(param);
    }
    if (_data) {
      toast.success("Success");
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.status = e.status ? 1 : 0;
    saveFormData(e);
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
          initialValue={formData.user_department_code}
          label="Department Code"
          name="user_department_code"
          rules={[
            { required: true, message: "Please input your Department Code!" },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.user_department_name}
          label="Department Name"
          name="user_department_name"
          rules={[
            {
              required: true,
              message: "Please input your Department Name!",
            },
          ]}
        >
          <Input disabled={type == "read"} />
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
export default FormSection;

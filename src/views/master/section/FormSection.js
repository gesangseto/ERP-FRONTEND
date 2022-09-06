import { Button, Card, Form, Input, Select, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval } from "component";
import { getRoute } from "helper/utils";
// import { updateDepartment } from "resource/administrator/department";
import {
  getDepartment,
  getSection,
  insertSection,
  updateSection,
} from "resource";

const FormSection = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [listDepart, setListDepart] = useState([]);
  const [formData, setFormData] = useState({
    user_department_id: "",
    user_section_name: "",
    user_section_code: "",
  });

  useEffect(() => {
    (async function () {
      if (id) {
        await loadFormData(id);
      }
      await loadDepartment();
    })();
  }, []);

  useEffect(() => {
    if (formData.user_department_id) form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getSection({ user_section_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const loadDepartment = async () => {
    let _data = await getDepartment({ status: 1 });

    _data = _data.data;
    setListDepart([..._data]);
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.user_section_id = id;
      _data = await updateSection(param);
    } else {
      _data = await insertSection(param);
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
          size: "default",
        }}
        size={"default"}
      >
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
          <Select disabled={type == "read"}>
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
          initialValue={formData.user_section_code}
          label="Section Code"
          name="user_section_code"
          rules={[
            { required: true, message: "Please input your Section Code!" },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.user_section_name}
          label="Section Name"
          name="user_section_name"
          rules={[
            {
              required: true,
              message: "Please input your Section Name!",
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
            type="success"
            htmlType="submit"
            disabled={type == "read"}
          >
            Save
          </Button>
          &nbsp;
          <Button type="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Form.Item>
      </Form>
      <XFormApproval item={formData} />
    </Card>
  );
};
export default FormSection;

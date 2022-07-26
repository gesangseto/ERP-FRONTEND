import { Button, Card, Form, Input, Switch } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval } from "../../../component";
// import { updateCustomer } from "../../../resource/administrator/department";
import { getCustomer, insertCustomer, updateCustomer } from "../../../resource";
import routes from "../../../routes";

const FormCust = () => {
  let { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mst_customer_id: "",
    mst_customer_pic: "",
    mst_customer_name: "",
    mst_customer_email: "",
    mst_customer_address: "",
    mst_customer_phone: "",
    mst_customer_ppn: "",
    mst_customer_percentage: "",
  });

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getCustomer({ mst_customer_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.mst_customer_id = id;
      _data = await updateCustomer(param);
    } else {
      _data = await insertCustomer(param);
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
          initialValue={formData.mst_customer_pic}
          label="Customer Pic"
          name="mst_customer_pic"
          rules={[
            { required: true, message: "Please input your Customer PIC!" },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.mst_customer_name}
          label="Customer Name"
          name="mst_customer_name"
          rules={[
            {
              required: true,
              message: "Please input your Customer Name!",
            },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.mst_customer_email}
          label="Customer Email"
          name="mst_customer_email"
          rules={[
            { required: true, message: "Please input your Customer Email!" },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.mst_customer_phone}
          label="Customer Phone"
          name="mst_customer_phone"
          rules={[
            { required: true, message: "Please input your Customer Phone!" },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.mst_customer_address}
          label="Customer Address"
          name="mst_customer_address"
          rules={[
            { required: true, message: "Please input your Customer Address!" },
          ]}
        >
          <TextArea disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.mst_customer_ppn}
          label="PPN"
          name="mst_customer_ppn"
        >
          <Input disabled={type == "read"} type="number" min={0} />
        </Form.Item>
        <Form.Item
          initialValue={formData.price_percentage}
          label="Percentage"
          name="price_percentage"
        >
          <Input disabled={type == "read"} type="number" min={0} />
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
      <XFormApproval item={formData} />
    </Card>
  );
};
export default FormCust;

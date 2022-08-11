import { PercentageOutlined } from "@ant-design/icons";
import { Button, Card, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  XFormApproval,
  XInput,
  XInputNumber,
  XSwitch,
  XTextArea,
} from "component";
import { getRoute } from "helper/utils";

import { getCustomer, insertCustomer, updateCustomer } from "resource";

const FormCust = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
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
        <XInput
          title="Customer PIC"
          name={"mst_customer_pic"}
          initialValue={formData.mst_customer_pic}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Customer Name"
          name={"mst_customer_name"}
          initialValue={formData.mst_customer_name}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Customer Email"
          name={"mst_customer_email"}
          initialValue={formData.mst_customer_email}
          disabled={type == "read"}
          required
          type="email"
        />
        <XInput
          title="Customer Phone"
          name={"mst_customer_phone"}
          initialValue={formData.mst_customer_phone}
          disabled={type == "read"}
          required
        />
        <XTextArea
          title="Customer Address"
          name={"mst_customer_address"}
          initialValue={formData.mst_customer_address}
          disabled={type == "read"}
          required
        />
        <XInputNumber
          title="PPN"
          name={"mst_customer_ppn"}
          initialValue={formData.mst_customer_ppn}
          disabled={type == "read"}
          addonAfter={<PercentageOutlined />}
        />
        <XInputNumber
          title="Percentage"
          name={"price_percentage"}
          initialValue={formData.price_percentage}
          disabled={type == "read"}
          addonAfter={<PercentageOutlined />}
        />
        <XSwitch
          title="Status"
          name={"status"}
          initialValue={formData.status}
          disabled={type == "read"}
        />
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
export default FormCust;

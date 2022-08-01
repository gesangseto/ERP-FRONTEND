import { Button, Card, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval, XInput, XSwitch, XTextArea } from "../../../component";
import { getRoute } from "../../../helper/utils";
import { getSupplier, insertSupplier, updateSupplier } from "../../../resource";

const FormSupplier = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mst_supplier_id: "",
    mst_supplier_pic: "",
    mst_supplier_name: "",
    mst_supplier_email: "",
    mst_supplier_address: "",
    mst_supplier_phone: "",
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
    let _data = await getSupplier({ mst_supplier_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.mst_supplier_id = id;
      _data = await updateSupplier(param);
    } else {
      _data = await insertSupplier(param);
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
          title="Supplier PIC"
          name={"mst_supplier_pic"}
          initialValue={formData.mst_supplier_pic}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Supplier Name"
          name={"mst_supplier_name"}
          initialValue={formData.mst_supplier_name}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Supplier Email"
          name={"mst_supplier_email"}
          initialValue={formData.mst_supplier_email}
          disabled={type == "read"}
          required
          type="email"
        />
        <XInput
          title="Supplier Phone"
          name={"mst_supplier_phone"}
          initialValue={formData.mst_supplier_phone}
          disabled={type == "read"}
          required
        />
        <XTextArea
          title="Supplier Address"
          name={"mst_supplier_address"}
          initialValue={formData.mst_supplier_address}
          disabled={type == "read"}
          required
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
export default FormSupplier;

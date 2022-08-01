import { Button, Card, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval, XInput, XSwitch, XTextArea } from "../../../component";
import { getRoute } from "../../../helper/utils";
import {
  getPackaging,
  insertPackaging,
  updatePackaging,
} from "../../../resource";

const FormPackaging = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mst_packaging_id: "",
    mst_packaging_code: "",
    mst_packaging_name: "",
    mst_packaging_desc: "",
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
    let _data = await getPackaging({ mst_packaging_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.mst_packaging_id = id;
      _data = await updatePackaging(param);
    } else {
      _data = await insertPackaging(param);
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
          title="Packaging Code"
          name={"mst_packaging_code"}
          initialValue={formData.mst_packaging_code}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Packaging Name"
          name={"mst_packaging_name"}
          initialValue={formData.mst_packaging_name}
          disabled={type == "read"}
          required
        />
        <XTextArea
          title="Packaging Desc"
          name={"mst_packaging_desc"}
          initialValue={formData.mst_packaging_desc}
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
export default FormPackaging;

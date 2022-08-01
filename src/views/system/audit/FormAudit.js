import { Button, Card, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { XFormApproval, XInput, XTextArea } from "../../../component";
import { getRoute } from "../../../helper/utils";
import { getAudit } from "../../../resource";

const FormAudit = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData.id]);

  const loadFormData = async (id) => {
    let _data = await getAudit({ id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
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
          title="Username"
          name={"user_name"}
          initialValue={formData.user_name}
        />
        <XInput
          title="Email"
          name={"user_email"}
          initialValue={formData.user_email}
        />
        <XTextArea
          title="Agent"
          name={"user_agent"}
          initialValue={formData.user_agent}
        />
        <XInput
          title="IP"
          name={"ip_address"}
          initialValue={formData.ip_address}
        />
        <XInput
          title="Path"
          name={"Path"}
          initialValue={formData.path}
          addonBefore={formData.type}
        />
        <XTextArea title="Data" name={"data"} initialValue={formData.data} />
        <Form.Item>
          &nbsp;
          <Button type="danger" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Form.Item>
      </Form>
      <XFormApproval item={formData} />
    </Card>
  );
};
export default FormAudit;

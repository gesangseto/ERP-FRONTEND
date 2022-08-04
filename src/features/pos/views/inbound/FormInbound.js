import { Button, Card, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval, XInput, XInputNumber } from "../../../../component";
import { getRoute } from "../../../../helper/utils";

import moment from "moment";
import { insertCustomer, updateCustomer } from "../../../../resource";
import { getInbound } from "../../resource";
import { XFormReadReceive } from "../../component";

const FormInbound = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ detail: [] });

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
    let _data = await getInbound({ pos_trx_inbound_id: id });
    _data = _data.data[0];
    console.log(_data);
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.pos_trx_inbound_id = id;
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
          title="Created At"
          name={"created_at"}
          initialValue={moment(formData.created_at).format(
            "YYYY-MM-DD hh:mm:ss"
          )}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Created By"
          name={"user_name"}
          initialValue={formData.user_name}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Type"
          name={"pos_trx_inbound_type"}
          initialValue={formData.pos_trx_inbound_type}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Source"
          name={"pos_trx_inbound_id"}
          initialValue={
            formData.mst_supplier_name
              ? formData.mst_supplier_name
              : formData.mst_customer_name
          }
          disabled={type == "read"}
          required
        />
        <XInput
          title="Product"
          name={"mst_item_name"}
          initialValue={formData.mst_item_name}
          disabled={type == "read"}
          required
        />
        <XInputNumber
          title="Quantity Item"
          name={"qty"}
          initialValue={formData.qty}
          disabled={type == "read"}
        />

        <XFormReadReceive data={formData.detail} />
        <Form.Item>
          <Button type="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Form.Item>
      </Form>
      <XFormApproval item={formData} />
    </Card>
  );
};
export default FormInbound;

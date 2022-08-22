import { Button, Card, Form } from "antd";
import { XFormApproval, XInput, XSelect, XTextArea } from "component";
import { getRoute, makeOption } from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  XFormReceive,
  XTableDetailTrx,
  XTableDetailUser,
} from "features/pos/component";
import {
  getReceive,
  getUserBranch,
  insertReceive,
  updateReceive,
} from "features/pos/resource";
import { getSupplier } from "resource";

const FormUserBranch = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...{}, detail: [] });

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData.pos_branch_id]);

  const loadFormData = async (id) => {
    let _data = await getUserBranch({ pos_branch_id: id });
    _data = _data.data[0];
    console.log(_data);
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _body = { ...formData, ...param };
    let _item = [];
    for (const it of _body.item) {
      if (it.mst_item_variant_id) {
        _item.push(it);
      }
    }
    _body.item = _item;
    let _data;
    if (id) {
      param.mst_customer_id = id;
      _data = await updateReceive(_body);
    } else {
      _data = await insertReceive(_body);
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
        // onFinish={(e) => handleSubmit(e)}
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
          title="Branch Name"
          name={"pos_branch_name"}
          initialValue={formData.pos_branch_name}
          disabled
        />
        <XInput
          title="Desc"
          name={"pos_branch_desc"}
          initialValue={formData.pos_branch_desc}
          disabled
        />
        <XInput
          title="Phone"
          name={"pos_branch_phone"}
          initialValue={formData.pos_branch_phone}
          disabled
        />
        <XTextArea
          title="Address"
          name={"pos_branch_address"}
          initialValue={formData.pos_branch_address}
          disabled
        />
        <XTableDetailUser data={formData.detail} />

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
export default FormUserBranch;

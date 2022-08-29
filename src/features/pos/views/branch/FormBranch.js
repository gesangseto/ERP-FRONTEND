import { Button, Card, Form } from "antd";
import {
  XFormApproval,
  XInput,
  XInputNumber,
  XSwitch,
  XTextArea,
} from "component";
import { getBranch, insertBranch, updateBranch } from "features/pos/resource";
import { getRoute } from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const FormBranch = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    allow_return_day: 0,
    pos_branch_name: null,
    pos_branch_code: null,
    pos_branch_desc: null,
    pos_branch_address: null,
    pos_branch_phone: null,
    pos_branch_id: null,
    status: 1,
  });
  const [listProduct, setListProduct] = useState([]);

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    if (formData.pos_branch_id) form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getBranch({ pos_branch_id: id });
    if (_data) {
      setFormData({ ..._data.data[0] });
    }
  };
  const saveFormData = async (param = Object) => {
    param = { ...formData, ...param };
    let _data;
    if (id) {
      _data = await updateBranch(param);
    } else {
      _data = await insertBranch(param);
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
      >
        <XInput
          disabled={type == "read"}
          required
          title="Branch Name"
          name="pos_branch_name"
          initialValue={formData.pos_branch_name}
        />
        <XInput
          disabled={type == "read"}
          required
          title="Branch Code"
          name="pos_branch_code"
          initialValue={formData.pos_branch_code}
        />
        <XInput
          disabled={type == "read"}
          required
          title="Desc"
          name="pos_branch_desc"
          initialValue={formData.pos_branch_desc}
        />
        <XInputNumber
          required
          title="Phone"
          name={"pos_branch_phone"}
          initialValue={formData.pos_branch_phone}
          disabled={type == "read"}
          addonBefore={"+62"}
        />
        <XTextArea
          disabled={type == "read"}
          required
          title="Address"
          name="pos_branch_address"
          initialValue={formData.pos_branch_address}
        />
        <XInputNumber
          title="Allow returning day"
          name={"allow_return_day"}
          initialValue={formData.allow_return_day}
          disabled={type == "read"}
          min={0}
          max={100}
          addonAfter={"Day"}
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
export default FormBranch;

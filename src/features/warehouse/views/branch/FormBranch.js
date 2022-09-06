import { Button, Card, Form } from "antd";
import {
  XFormApproval,
  XInput,
  XInputNumber,
  XSwitch,
  XTextArea,
} from "component";
import {
  getBranch,
  insertBranch,
  updateBranch,
} from "features/warehouse/resource";

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
    wh_mst_branch_id: null,
    wh_mst_branch_code: null,
    wh_mst_branch_name: null,
    wh_mst_branch_desc: null,
    wh_mst_branch_address: null,
    status: 1,
  });

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    if (formData.wh_mst_branch_id) form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getBranch({ wh_mst_branch_id: id });
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
          name="wh_mst_branch_name"
          initialValue={formData.wh_mst_branch_name}
        />
        <XInput
          disabled={type == "read"}
          required
          title="Branch Code"
          name="wh_mst_branch_code"
          initialValue={formData.wh_mst_branch_code}
        />
        <XInput
          disabled={type == "read"}
          required
          title="Desc"
          name="wh_mst_branch_desc"
          initialValue={formData.wh_mst_branch_desc}
        />
        <XTextArea
          disabled={type == "read"}
          required
          title="Address"
          name="wh_mst_branch_address"
          initialValue={formData.wh_mst_branch_address}
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

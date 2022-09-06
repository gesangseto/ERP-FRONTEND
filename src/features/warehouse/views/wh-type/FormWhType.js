import { Button, Card, Col, Form, Row, Space } from "antd";
import { XFormApproval, XInput, XSwitch, XTableV2 } from "component";
import {
  getWhType,
  insertWhType,
  updateWhType,
} from "features/warehouse/resource";

import { getRoute } from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const WhType = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    wh_mst_wh_type_id: null,
    wh_mst_wh_type_code: null,
    wh_mst_wh_type_name: null,
    wh_mst_wh_type_desc: null,
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
    if (formData.wh_mst_wh_type_id) form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getWhType({ wh_mst_wh_type_id: id });
    if (_data) {
      setFormData({ ..._data.data[0] });
    }
  };
  const saveFormData = async (param = Object) => {
    param = { ...formData, ...param };
    let _data;
    if (id) {
      _data = await updateWhType(param);
    } else {
      _data = await insertWhType(param);
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
          name="wh_mst_wh_type_name"
          initialValue={formData.wh_mst_wh_type_name}
        />
        <XInput
          disabled={type == "read"}
          required
          title="Branch Code"
          name="wh_mst_wh_type_code"
          initialValue={formData.wh_mst_wh_type_code}
        />
        <XInput
          disabled={type == "read"}
          required
          title="Desc"
          name="wh_mst_wh_type_desc"
          initialValue={formData.wh_mst_wh_type_desc}
        />
        <XSwitch
          title="Status"
          name={"status"}
          initialValue={formData.status}
          disabled={type == "read"}
        />
        <Card title="Configuration">
          <Row>
            <Col span={2}>Packing</Col>
            <Col span={3}>
              <XSwitch
                useTitle={false}
                name={"support_packing"}
                initialValue={formData.support_packing}
                disabled={type == "read"}
              />
            </Col>
            <Col span={2}>Operation</Col>
            <Col span={3}>
              <XSwitch
                useTitle={false}
                name={"support_operation"}
                initialValue={formData.support_operation}
                disabled={type == "read"}
              />
            </Col>
            <Col span={2}>Transfer</Col>
            <Col span={3}>
              <XSwitch
                useTitle={false}
                name={"support_transfer"}
                initialValue={formData.support_transfer}
                disabled={type == "read"}
              />
            </Col>
            <Col span={2}>Picking</Col>
            <Col span={3}>
              <XSwitch
                useTitle={false}
                name={"support_picking"}
                initialValue={formData.support_picking}
                disabled={type == "read"}
              />
            </Col>
            <Col span={2}>Return</Col>
            <Col span={2}>
              <XSwitch
                useTitle={false}
                name={"support_return"}
                initialValue={formData.support_return}
                disabled={type == "read"}
              />
            </Col>
          </Row>
        </Card>
        <br />
        <br />
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
export default WhType;

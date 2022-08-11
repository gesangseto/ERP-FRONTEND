import { Button, Card, Form } from "antd";
import { XFormApproval, XInput } from "component";
import { getRoute } from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { XTableDetailTrx } from "features/pos/component";
import { approveReturn, getReturn } from "features/pos/resource";

const FormReturn = () => {
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
  }, [formData.pos_trx_return_id]);

  const loadFormData = async (id) => {
    let _data = await getReturn({ pos_trx_return_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _body = { ...formData, ...param };
    let _data = false;
    if (id) {
      _data = await approveReturn(_body);
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
          title="Customer"
          name={"mst_customer_name"}
          initialValue={formData.mst_customer_name}
          disabled={type != "create"}
          required
        />
        <XInput
          title="INVOICE"
          name={"pos_trx_sale_id"}
          initialValue={formData.pos_trx_sale_id}
          disabled={type != "create"}
          required
        />
        {id && <XTableDetailTrx data={formData.detail} />}

        <Form.Item>
          {type == "create" ? (
            <Button
              loading={loading}
              type="success"
              htmlType="submit"
              disabled={type == "read"}
            >
              Save
            </Button>
          ) : null}
          {formData.status == 0 ? (
            <>
              <Button
                loading={loading}
                type="success"
                htmlType="submit"
                disabled={type == "read"}
                onClick={() => setFormData({ ...formData, is_approve: "true" })}
              >
                Proccess
              </Button>
              &nbsp;
              <Button
                loading={loading}
                type="danger"
                htmlType="submit"
                disabled={type == "read"}
                onClick={() =>
                  setFormData({ ...formData, is_approve: "false" })
                }
              >
                Reject
              </Button>
            </>
          ) : null}
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
export default FormReturn;

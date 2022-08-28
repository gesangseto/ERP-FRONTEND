import { Button, Card, Form } from "antd";
import { XFormApproval, XTextArea } from "component";
import { getRoute, makeOption } from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  XFormReceive,
  XSelectUserBranch,
  XTableDetailTrx,
} from "features/pos/component";
import {
  getDestroy,
  insertDestroy,
  updateDestroy,
} from "features/pos/resource";
import { getSupplier } from "resource";
import XSelectUserBranchForm from "features/pos/component/XSelectUserBranchForm";

const FormDestroy = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...{}, item: [] });
  const [listSupplier, setListSupplier] = useState([]);

  useEffect(() => {
    (async function () {
      loadSupplier();
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData.pos_trx_destroy_id]);

  const loadSupplier = async () => {
    let _data = await getSupplier();
    _data = _data.data;
    _data = makeOption(_data, "mst_supplier_id", "mst_supplier_name");
    setListSupplier([..._data]);
  };

  const loadFormData = async (id) => {
    let _data = await getDestroy({ pos_trx_destroy_id: id });
    _data = _data.data[0];
    setFormData({ ..._data, item: _data.detail });
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
      _data = await updateDestroy(_body);
    } else {
      _data = await insertDestroy(_body);
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
        <XSelectUserBranchForm
          required={false}
          name={"pos_branch_code"}
          initialValue={formData.pos_branch_code}
        />
        {type != "create" ? (
          <XTextArea
            title="Note"
            name={"pos_trx_destroy_note"}
            initialValue={formData.pos_trx_destroy_note}
            disabled={formData.status != 0}
            required
          />
        ) : null}
        {type == "create" ? (
          <XFormReceive
            onChange={(data) => setFormData({ ...formData, item: data })}
          />
        ) : (
          <XTableDetailTrx data={formData.item} />
        )}

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
export default FormDestroy;

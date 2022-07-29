import { Button, Card, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval, XSelect, XTextArea } from "../../../../component";
import { makeOption } from "../../../../helper/utils";

import { getSupplier } from "../../../../resource";
import routes from "../../../../routes";
import { XFormReceive, XFormReadReceive } from "../../component";
import { getReceive, insertReceive, updateReceive } from "../../resource";

const FormReceive = () => {
  let { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
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
  }, [formData.pos_receive_id]);

  const loadSupplier = async () => {
    let _data = await getSupplier();
    _data = _data.data;
    _data = makeOption(_data, "mst_supplier_id", "mst_supplier_name");
    setListSupplier([..._data]);
  };

  const loadFormData = async (id) => {
    let _data = await getReceive({ pos_receive_id: id });
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
        <XSelect
          title="Supplier"
          name={"mst_supplier_id"}
          initialValue={formData.mst_supplier_id}
          disabled={type != "create"}
          required
          option={listSupplier}
        />
        {type != "create" ? (
          <XTextArea
            title="Note"
            name={"pos_receive_note"}
            initialValue={formData.pos_receive_note}
            disabled={formData.status != 0}
            required
          />
        ) : null}
        <Card>
          {type == "create" ? (
            <XFormReceive
              onChange={(data) => setFormData({ ...formData, item: data })}
            />
          ) : (
            <XFormReadReceive data={formData.item} />
          )}
        </Card>

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
export default FormReceive;

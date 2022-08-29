import { Button, Card, Form } from "antd";
import {
  XFormApproval,
  XSelect,
  XSelectSearchForm,
  XTextArea,
} from "component";
import { getRoute, makeOption } from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { XFormReceive, XTableDetailTrx } from "features/pos/component";
import {
  getBranchByUser,
  getReceive,
  insertReceive,
  updateReceive,
} from "features/pos/resource";
import { getSupplier } from "resource";

const FormReceive = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...{}, item: [] });
  const [listSupplier, setListSupplier] = useState([]);
  const [listBranch, setListBranch] = useState([]);

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

  const loadBranch = async (e) => {
    let filter = { page: 1, limit: 10, search: e, status: 1 };
    let _data = await getBranchByUser(filter);
    if (_data) {
      setListBranch([..._data.data]);
    } else {
      setListBranch([]);
    }
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
    console.log(_body);
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
        <XSelectSearchForm
          allowClear
          disabled={type != "create"}
          required
          title="Branch Code"
          placeholder="Input search text"
          name="pos_branch_code"
          onSearch={(e) => loadBranch(e)}
          option={listBranch.map((it) => {
            return {
              text: `(${it.pos_branch_code}) ${it.pos_branch_name}`,
              value: it.pos_branch_code,
            };
          })}
          onChange={(val) => setFormData({ ...formData, pos_branch_code: val })}
          initialValue={formData.pos_branch_code}
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
        {type == "create" ? (
          <XFormReceive
            onChange={(data) => setFormData({ ...formData, item: data })}
          />
        ) : (
          <XTableDetailTrx data={formData.item} />
        )}
        <br />
        <br />
        <br />

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

import { Button, Card, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  XFormApproval,
  XSelect,
  XSelectSearchForm,
} from "../../../../component";
import moment from "moment";
import { getRoute, makeOption } from "../../../../helper/utils";

import { getCustomer } from "../../../../resource";
import { XTableDetailTrx } from "../../component";
import {
  getReturn,
  getSale,
  insertReceive,
  updateReceive,
} from "../../resource";

const FormReturn = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...{}, detail: [] });
  const [listCustomer, setListCustomer] = useState([]);
  const [listSale, setListSale] = useState([]);

  useEffect(() => {
    (async function () {
      loadCustomer();
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData.pos_trx_return_id]);

  const loadCustomer = async () => {
    let _data = await getCustomer();
    _data = _data.data;
    _data = makeOption(_data, "mst_customer_id", "mst_customer_name");
    setListCustomer([..._data]);
  };

  const loadSale = async (e) => {
    let filter = { page: 1, limit: 10, search: e };
    let _data = await getSale(filter);
    if (_data) {
      setListSale([..._data.data]);
    }
  };

  const loadFormData = async (id) => {
    let _data = await getReturn({ pos_trx_return_id: id });
    _data = _data.data[0];
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
          title="Customer"
          name={"mst_customer_id"}
          initialValue={formData.mst_customer_id}
          disabled={type != "create"}
          required
          option={listCustomer}
        />
        <XSelectSearchForm
          allowClear
          required
          title="INVOICE"
          placeholder="input search text"
          name="pos_trx_sale_id"
          onSearch={(e) => loadSale(e)}
          option={listSale.map((it) => {
            return {
              text: `(${it.pos_trx_sale_id}) ${moment(it.created_at).format(
                "YY/MM/DD hh:mm:ss"
              )}`,
              value: it.pos_trx_sale_id,
            };
          })}
          // onChange={(val) => handleChangeRowProduct(val, index)}
          // initialValue={"1"}
        />
        {/* {type == "create" ? null : ( // /> //   onChange={(data) => setFormData({ ...formData, item: data })} // <XFormReceive
          
        )} */}
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

import { Button, Card, Form, Radio, Space } from "antd";
import {
  XDateRangePicker,
  XFormApproval,
  XInputNumber,
  XRadio,
  XSelectSearchForm,
  XSwitch,
} from "component";
import {
  getDiscount,
  insertDiscount,
  updateDiscount,
} from "features/pos/resource";
import { getProductVariant } from "features/pos/resource/product";
import { getRoute } from "helper/utils";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCustomer, insertCustomer, updateCustomer } from "resource";

const FormDiscount = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    discount_free_qty: 0,
    discount_max_qty: 0,
    discount_min_qty: 0,
    discount: 0,
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
    if (formData.pos_discount_id) form.current.resetFields();
    if (formData.barcode) loadProduct(formData.barcode);
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getDiscount({ pos_discount_id: id });
    _data = _data.data[0];
    let date = [];
    date[0] = moment(_data.pos_discount_starttime);
    date[1] = moment(_data.pos_discount_endtime);
    setFormData({
      ..._data,
      date_time: date,
    });
  };

  const loadProduct = async (e) => {
    let filter = { page: 1, limit: 10, search: e };
    let _data = await getProductVariant(filter);
    if (_data) {
      setListProduct([..._data.data]);
    } else {
      setListProduct([]);
    }
  };
  const saveFormData = async (param = Object) => {
    param = { ...formData, ...param };
    let _data;
    if (id) {
      _data = await updateDiscount(param);
    } else {
      _data = await insertDiscount(param);
    }
    if (_data) {
      toast.success("Success");
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.pos_discount_starttime = moment(e.date_time[0]).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    e.pos_discount_endtime = moment(e.date_time[1]).format(
      "YYYY-MM-DD HH:mm:ss"
    );
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
        <XSelectSearchForm
          allowClear
          disabled={type != "create"}
          required
          title="Variant"
          placeholder="Input search text"
          name="mst_item_variant_id"
          onSearch={(e) => loadProduct(e)}
          option={listProduct.map((it) => {
            return {
              text: `(${it.mst_item_name}) ${it.mst_item_variant_name} @${it.mst_item_variant_qty}`,
              value: it.mst_item_variant_id,
            };
          })}
          onChange={(val) =>
            setFormData({ ...formData, mst_item_variant_id: val })
          }
          initialValue={formData.mst_item_variant_id}
        />
        <XDateRangePicker
          title="Discount Time"
          name={"date_time"}
          defaultPickerValue={formData.date_time}
          // defaultValue={formData.date_time}
          initialValue={formData.date_time}
          disabled={type != "create"}
          required
          showTime
        />
        <XInputNumber
          title="Min Qty"
          name={"discount_min_qty"}
          initialValue={formData.discount_min_qty}
          disabled={type != "create"}
          min={0}
          max={100}
        />
        <XInputNumber
          title="Max Qty"
          name={"discount_max_qty"}
          initialValue={formData.discount_max_qty}
          disabled={type != "create"}
          min={0}
          max={100}
        />

        <XInputNumber
          title="Discount"
          name={"discount"}
          initialValue={formData.discount}
          disabled={type != "create" || formData.discount_free_qty}
          onChange={(e) => setFormData({ ...formData, discount: e })}
          addonAfter={"%"}
          min={0}
          max={100}
          required
        />
        <XInputNumber
          title="Free Qty"
          name={"discount_free_qty"}
          initialValue={formData.discount_free_qty}
          disabled={type != "create" || formData.discount}
          onChange={(e) => setFormData({ ...formData, discount_free_qty: e })}
          min={0}
          max={100}
          required
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
export default FormDiscount;

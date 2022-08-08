import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Form, Popconfirm, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  XFormApproval,
  XFormItemVariant,
  XInput,
  XSwitch,
  XTextArea,
} from "component";
import { getRoute } from "helper/utils";

import {
  deleteProduct,
  getProduct,
  insertProduct,
  updateProduct,
} from "resource";

const FormItem = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [openFormVariant, setOpenFormVariant] = useState(false);
  const [variantData, setVariantData] = useState({});
  const [formData, setFormData] = useState({
    mst_item_id: "",
    mst_item_no: "",
    mst_item_code: "",
    mst_item_name: "",
    mst_item_desc: "",
    variant: [],
  });

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    if (formData.mst_item_id) form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getProduct({ mst_item_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _data;
    param = { ...formData, ...param };
    if (id) {
      param.mst_item_id = id;
      _data = await updateProduct(param);
    } else {
      _data = await insertProduct(param);
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

  const handleClickVariant = (record, index) => {
    record.index = index;
    setVariantData({ ...record });
    setOpenFormVariant(true);
  };

  const handleDeleteVariant = async (record, index) => {
    if (record.hasOwnProperty("mst_item_variant_id")) {
      let _res = await deleteProduct({
        mst_item_variant_id: record.mst_item_variant_id,
      });
      if (!_res) {
        return;
      }
    }
    let variant = formData.variant;
    variant.splice(index, 1);
    setFormData({ ...formData, variant: variant });
  };

  const handleCloseModal = () => {
    setVariantData({ ...{} });
    setOpenFormVariant(false);
  };

  const handleChangeVariant = (e) => {
    let variant = formData.variant;
    if (e.hasOwnProperty("index")) {
      variant[e.index] = e;
    } else {
      variant.push(e);
    }
    setFormData({ ...formData, variant: variant });
    handleCloseModal();
  };

  const columns = () => {
    return [
      {
        title: "Barcode",
        key: "barcode",
        dataIndex: "barcode",
      },
      {
        title: "Variant",
        key: "mst_item_variant_name",
        dataIndex: "mst_item_variant_name",
      },
      {
        title: "Packaging",
        key: "mst_packaging_name",
        dataIndex: "mst_packaging_name",
        render: (_, record) => (
          <p>
            {record.mst_packaging_name}{" "}
            {record.mst_packaging_code ? `(${record.mst_packaging_code})` : ""}
          </p>
        ),
      },
      {
        title: "Qty",
        key: "mst_item_variant_qty",
        dataIndex: "mst_item_variant_qty",
      },
      {
        title: "Price",
        key: "mst_item_variant_price",
        dataIndex: "mst_item_variant_price",
      },
      {
        title: "Status",
        key: "status",
        render: (i, rec) => (
          <p style={{ color: rec.status ? "green" : "red" }}>
            {rec.status ? "Active" : "Inactive"}
          </p>
        ),
      },
      {
        title: "",
        key: "mst_item_variant_id",
        dataIndex: "barcode",
        render: (_, record, dataIndex) => (
          <>
            <Popconfirm
              title="Are you sure to delete this data?"
              onConfirm={() => handleDeleteVariant(record, dataIndex)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type="danger">
                Delete
              </Button>
            </Popconfirm>
            &nbsp;
            <Button
              size="small"
              onClick={() => handleClickVariant(record, dataIndex)}
            >
              Change
            </Button>
          </>
        ),
      },
    ];
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
          title="Product NO"
          name={"mst_item_no"}
          initialValue={formData.mst_item_no}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Product Code"
          name={"mst_item_code"}
          initialValue={formData.mst_item_code}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Product Name"
          name={"mst_item_name"}
          initialValue={formData.mst_item_name}
          disabled={type == "read"}
          required
        />
        <XTextArea
          title="Product Desc"
          name={"mst_item_desc"}
          initialValue={formData.mst_item_desc}
          disabled={type == "read"}
          required
        />
        <XSwitch
          title="Status"
          name={"status"}
          initialValue={formData.status}
          disabled={type == "read"}
        />
        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Button type="success" onClick={() => setOpenFormVariant(true)}>
            <PlusCircleOutlined /> Add Variant
          </Button>
        </Form.Item>
        <Table
          columns={columns()}
          dataSource={[...formData.variant]}
          rowKey={"mst_item_variant_id"}
          pagination={null}
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
      <XFormItemVariant
        initialValue={variantData}
        visible={openFormVariant}
        onClose={() => {
          handleCloseModal();
        }}
        onSave={(val) => handleChangeVariant(val)}
      />
    </Card>
  );
};
export default FormItem;

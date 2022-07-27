import { PercentageOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { getPackaging } from "../resource";
import XInput from "./XInput";
import XInputNumber from "./XInputNumber";
import XSwitch from "./XSwitch";
import XTextArea from "./XTextArea";

const XFormItemVariant = (props) => {
  const { initialValue, visible, onClose, onSave } = props;
  const formVariant = useRef(null);
  const [listPackaging, setListPackaging] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    formVariant.current?.resetFields();
  }, [initialValue, visible]);

  useEffect(() => {
    loadPackaging();
  }, []);

  const loadPackaging = async () => {
    let _data = await getPackaging({ status: 1 });
    if (_data) {
      setListPackaging([..._data.data]);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.status = e.status ? 1 : 0;
    if (onSave) {
      onSave({ ...initialValue, ...e, ...formData });
    }
  };

  return (
    // <div className="site-drawer-render-in-current-wrapper">
    <>
      <Modal
        title="Variant Product"
        visible={visible}
        // onOk={handleOk}
        onCancel={() => handleClose()}
        footer={null}
      >
        <Form
          ref={formVariant}
          defaultValue={initialValue}
          onFinish={(e) => handleSubmit(e)}
          labelCol={{
            span: 8,
          }}
          layout="horizontal"
          initialValues={{
            size: "default",
          }}
          size={"default"}
        >
          <XInput
            title="Variant Name"
            name={"mst_item_variant_name"}
            initialValue={initialValue.mst_item_variant_name}
            required
          />
          <Form.Item
            initialValue={initialValue.mst_packaging_id}
            label="Packaging"
            name="mst_packaging_id"
            rules={[
              {
                required: true,
                message: "Please input your Packaging!",
              },
            ]}
          >
            <Select
              onChange={(e, o) =>
                setFormData({
                  ...formData,
                  mst_packaging_name: o.children.join(""),
                })
              }
            >
              {listPackaging.map((item, idx) => {
                return (
                  <Select.Option key={idx} value={item.mst_packaging_id}>
                    {item.mst_packaging_name} ({item.mst_packaging_code})
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <XInput
            title="Barcode"
            name={"barcode"}
            initialValue={initialValue.barcode}
            required
          />
          <XInputNumber
            title="Price"
            name={"mst_item_variant_price"}
            initialValue={initialValue.mst_item_variant_price}
            required
            addonBefore={"Rp"}
          />
          <XInputNumber
            title="Quantity"
            name={"mst_item_variant_qty"}
            initialValue={initialValue.mst_item_variant_qty}
            required
          />
          <XSwitch
            title="Status"
            name={"status"}
            initialValue={initialValue.status}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
    // </div>
  );
};

export default XFormItemVariant;

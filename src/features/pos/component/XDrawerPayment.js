import { Button, Drawer, Form, Space } from "antd";
import React, { useRef } from "react";
import { XInput, XInputNumber } from "../../../component";

const XDrawerPayment = (props) => {
  const { data, onClose } = props;
  const inputCash = useRef(null);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Drawer
      title={`INVOICE : ${data.pos_trx_sale_id}`}
      placement={"right"}
      width={500}
      onClose={() => handleClose()}
      visible={true}
      extra={
        <Space>
          <Button type="primary">Paid</Button>
        </Space>
      }
      {...props}
    >
      <Form
        onFinish={(e) => handleSubmit(e)}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        defaultValue={data}
      >
        <XInput
          title="Payment Type"
          initialValue={"Cash"}
          name="payment_type"
        />
        <XInputNumber
          ref={inputCash}
          title="Cash"
          initialValue={0}
          name="payment_cash"
          addonBefore={"Rp."}
          autoFocus
        />
        <XInputNumber
          title="Change"
          initialValue={0}
          name="payment_change"
          addonBefore={"Rp."}
          value={0}
        />
      </Form>
    </Drawer>
  );
};
export default XDrawerPayment;

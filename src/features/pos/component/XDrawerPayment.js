import { Button, Drawer, Form, InputNumber, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { XInput, XInputNumber } from "../../../component";
import { numberWithComma } from "../../../helper/utils";

const XDrawerPayment = React.forwardRef((props, ref) => {
  const { data, onClose, onClickPaid } = props;
  const [formData, setFormData] = useState({
    pos_trx_sale_id: null,
    payment_type: "Cash",
  });
  const thisForm = useRef(null);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    setFormData({ ...formData, ...data });
  }, [data]);

  useEffect(() => {
    thisForm.current?.resetFields();
  }, [formData]);

  const handleClickPaid = () => {
    console.log(`onClickPaid(${JSON.stringify(formData)});`);
    if (onClickPaid) {
      onClickPaid(formData);
    }
  };
  return (
    <Drawer
      title={`INVOICE : ${formData.pos_trx_sale_id}`}
      placement={"right"}
      width={500}
      onClose={() => handleClose()}
      visible={true}
      extra={
        <Space>
          <Button
            disabled={formData.payment_change >= 0 ? false : true}
            type="primary"
            onClick={() => handleClickPaid()}
          >
            Paid
          </Button>
        </Space>
      }
      {...props}
    >
      <Form
        ref={thisForm}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <XInput
          title="Total"
          name="grand_total"
          addonBefore={"Rp."}
          initialValue={numberWithComma(formData.grand_total)}
        />
        <XInput
          title="Payment Type"
          initialValue={formData.payment_type}
          name="payment_type"
        />
        <XInputNumber
          ref={ref}
          title="Cash [F12]"
          initialValue={formData.payment_cash ?? 0}
          name="payment_cash"
          addonBefore={"Rp."}
          autoFocus
          formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={(value) => {
            setFormData({
              ...formData,
              payment_cash: value,
              payment_change: value - formData.grand_total,
            });
          }}
          status={formData.payment_change >= 0 ? null : "error"}
        />
        <XInputNumber
          title="Change"
          initialValue={formData.payment_change}
          name={"payment_change"}
          addonBefore={"Rp."}
          formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          status={formData.payment_change >= 0 ? null : "error"}
        />
      </Form>
    </Drawer>
  );
});
export default XDrawerPayment;

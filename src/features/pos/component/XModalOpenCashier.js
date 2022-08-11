import { Button, Form, Modal } from "antd";
import { XInputNumber } from "component";
import { useEffect, useRef, useState } from "react";
// import { updateDepartment } from "resource/administrator/department";

const XModalOpenCashier = (props) => {
  const { initialValue, onSubmit } = props;
  const thisForm = useRef(null);
  const [formData, setFormData] = useState({
    pos_cashier_id: null,
    pos_cashier_capital_cash: null,
    pos_cashier_shift: null,
    pos_cashier_number: null,
  });
  useEffect(() => {
    setFormData({ ...initialValue });
    thisForm.current?.resetFields();
  }, [initialValue]);

  const handleSubmit = (val) => {
    let _data = { ...formData, ...val };
    if (onSubmit) {
      onSubmit(_data);
    }
    setFormData({ ..._data });
  };
  return (
    <>
      <Modal title="Form Cashier" okText="Approve" footer={null} {...props}>
        <p>
          The applicant tries to open a dialog to open or close cashier data on
          your own responsibility.
        </p>
        <Form
          ref={thisForm}
          defaultValue={formData}
          onFinish={(e) => handleSubmit(e)}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          layout="horizontal"
          initialValues={{
            size: "default",
          }}
          size={"default"}
        >
          <XInputNumber
            title="Shift"
            name={"pos_cashier_shift"}
            initialValue={formData.pos_cashier_shift}
            required
            disabled={formData.pos_cashier_id}
          />
          <XInputNumber
            title="Capital Cash"
            name={"pos_cashier_capital_cash"}
            initialValue={formData.pos_cashier_capital_cash}
            required
            addonBefore={"Rp"}
            disabled={formData.pos_cashier_id}
          />
          <Form.Item>
            {formData.pos_cashier_id ? (
              <Button type="danger" htmlType="submit">
                Close Cashier
              </Button>
            ) : (
              <Button type="success" htmlType="submit">
                Open Cashier
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default XModalOpenCashier;

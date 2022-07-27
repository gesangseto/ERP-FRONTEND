import { Form, Input, InputNumber } from "antd";
import React from "react";

const XInputNumber = (props) => {
  const { title, name, disabled, required, initialValue, onChange, min, max } =
    props;

  const handleChange = (e) => {
    let val = e.target.value;
    if (onChange) {
      onChange(val, e);
    }
  };

  return (
    <Form.Item
      initialValue={initialValue}
      label={title ?? "No Title"}
      name={name}
      rules={[
        {
          required: required,
          message: `Please input your ${title}!`,
        },
      ]}
      {...props}
    >
      <InputNumber
        disabled={disabled}
        onChange={(e) => handleChange(e)}
        min={min}
        max={max}
        {...props}
      />
    </Form.Item>
  );
};

export default XInputNumber;

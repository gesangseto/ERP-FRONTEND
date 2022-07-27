import { Form, Input } from "antd";
import React from "react";

const XInput = (props) => {
  const {
    title,
    name,
    disabled,
    required,
    initialValue,
    onChange,
    typeInput = "string",
  } = props;

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
          type: typeInput,
          required: required,
          message: `Please input your ${title}!`,
        },
      ]}
      {...props}
    >
      <Input disabled={disabled} onChange={(e) => handleChange(e)} {...props} />
    </Form.Item>
  );
};

export default XInput;

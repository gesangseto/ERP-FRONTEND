import { Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";

const XTextArea = (props) => {
  const { title, name, disabled, required, initialValue, onChange } = props;

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
      <TextArea disabled={disabled} onChange={(e) => handleChange(e)} />
    </Form.Item>
  );
};

export default XTextArea;

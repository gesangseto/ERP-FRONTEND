import { Form, Radio, Space, Switch } from "antd";
import React from "react";

const XRadio = (props) => {
  const {
    title,
    name,
    disabled,
    initialValue,
    onChange,
    option = Array,
  } = props;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <>
      <Form.Item
        initialValue={initialValue}
        label={title ?? "No Title"}
        name={name}
        valuePropName="checked"
        {...props}
      >
        <Radio.Group
        // onChange={onChange} value={value}
        >
          <Space direction="vertical">
            <Radio value={1}>Option A</Radio>
            <Radio value={2}>Option B</Radio>
            <Radio value={3}>Option C</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
    </>
  );
};

export default XRadio;

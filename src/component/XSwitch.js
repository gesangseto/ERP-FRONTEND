import { Form, Switch } from "antd";
import React from "react";

const XSwitch = (props) => {
  const { title, name, disabled, initialValue, onChange, ...rest } = props;

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
        {...rest}
      >
        <Switch disabled={disabled} onChange={(e) => handleChange(e)} />
      </Form.Item>
    </>
  );
};

export default XSwitch;

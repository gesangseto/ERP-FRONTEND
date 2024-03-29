import { Form, Switch } from "antd";
import React from "react";

const XSwitch = (props) => {
  const {
    title,
    name,
    disabled,
    initialValue,
    onChange,
    useForm = true,
    ...rest
  } = props;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <>
      {useForm ? (
        <Form.Item
          initialValue={initialValue}
          label={title ?? "No Title"}
          name={name}
          valuePropName="checked"
          {...rest}
        >
          <Switch disabled={disabled} onChange={(e) => handleChange(e)} />
        </Form.Item>
      ) : (
        <Switch disabled={disabled} {...rest} />
      )}
    </>
  );
};

export default XSwitch;

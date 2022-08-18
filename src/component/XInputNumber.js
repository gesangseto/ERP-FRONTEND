import { Form, Input, InputNumber } from "antd";
import React from "react";

const XInputNumber = React.forwardRef((props, ref) => {
  const {
    title,
    name,
    disabled,
    required,
    initialValue,
    onChange,
    min,
    max,
    rules,
    ...rest
  } = props;

  const handleChange = (e) => {
    let val = e;
    if (onChange) {
      onChange(val, e);
    }
  };

  return (
    <Form.Item
      initialValue={initialValue}
      label={title ?? "No Title"}
      name={name}
      rules={
        rules ?? [
          {
            required: required,
            message: `Please input your ${title}!`,
          },
        ]
      }
      // {...props}
    >
      <InputNumber
        ref={ref}
        disabled={disabled}
        onChange={(e) => handleChange(e)}
        min={min}
        max={max}
        {...rest}
      />
    </Form.Item>
  );
});

export default XInputNumber;

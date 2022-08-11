import { Form, Select } from "antd";
import React, { useEffect } from "react";

const XSelect = (props) => {
  const {
    title,
    option = Array,
    name,
    disabled,
    required,
    initialValue,
    onChange,
  } = props;

  useEffect(() => {}, [option]);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
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
      <Select disabled={disabled} onChange={(e) => handleChange(e)}>
        {option.length > 0 &&
          option.map((item, idx) => {
            return (
              <Select.Option
                key={idx}
                value={item.value}
                disabled={!item.status}
              >
                {item.label}
              </Select.Option>
            );
          })}
      </Select>
    </Form.Item>
  );
};

export default XSelect;

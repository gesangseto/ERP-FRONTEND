import { Form, DatePicker } from "antd";
import React from "react";
import moment from "moment";
const { RangePicker } = DatePicker;

// const dateFormat = "YYYY-MM-DD HH:mm:ss";
const XDateRangePicker = (props) => {
  const {
    title,
    name,
    disabled,
    required,
    initialValue,
    onChange,
    typeInput = "string",
    rules,
  } = props;

  const handleChange = (e) => {
    var date = [];
    date[0] = moment(e[0]).format("YYYY-MM-DD HH:mm:ss");
    date[1] = moment(e[1]).format("YYYY-MM-DD HH:mm:ss");
    // console.log(date);
    if (onChange) {
      onChange(date, e);
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
    >
      <RangePicker
        disabled={disabled}
        onChange={(e) => handleChange(e)}
        // format={dateFormat}
        {...props}
      />
    </Form.Item>
  );
};

export default XDateRangePicker;

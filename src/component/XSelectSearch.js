import { Select } from "antd";
import React, { useEffect, useState } from "react";
const { Option } = Select;

const XSelectSearch = React.forwardRef((props, ref) => {
  const { option, onSearch, onChange, initialValue, initialText, ...rest } =
    props;
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    setData([...option]);
    setValue(initialValue);
  }, [option, initialValue]);

  const handleSearch = (newValue) => {
    if (newValue) {
      if (onSearch) {
        onSearch(newValue);
      }
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue, item) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue, item);
    }
  };

  const handlePressKey = (key) => {
    if (key === "Enter") {
      if (data[0] && onChange) {
        onChange(data[0].value);
      }
    }
  };

  return (
    // <Form.Item ref={ref} name={name} initialValue={defaultValue}>
    <Select
      ref={ref}
      style={{
        maxWidth: 600,
        width: 200,
      }}
      {...rest}
      showSearch
      value={value}
      placeholder={props.placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      onInputKeyDown={(e) => handlePressKey(e.key)}
    >
      {data.map((d, index) => (
        <Option key={index} value={d.value} item={d}>
          {d.text}
        </Option>
      ))}
    </Select>
    // </Form.Item>
  );
});

export default XSelectSearch;

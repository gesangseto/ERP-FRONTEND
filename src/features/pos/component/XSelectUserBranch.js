import XSelectSearch from "component/XSelectSearch";
import { useEffect, useState } from "react";
import { getBranchByUser } from "../resource";

const XSelectUserBranch = (props) => {
  const { title, initialValue, onChange, ...rest } = props;
  const [listBranch, setListBranch] = useState([]);

  useEffect(() => {
    loadBranch();
  }, [initialValue]);

  const loadBranch = async (e) => {
    let filter = { page: 1, limit: 10, search: e, status: 1 };
    let _data = await getBranchByUser(filter);
    if (_data) {
      setListBranch([..._data.data]);
    } else {
      setListBranch([]);
    }
  };

  const handleChange = (val, item) => {
    console.log(val, item);
    if (onChange) {
      onChange(val, item);
    }
  };

  return (
    <XSelectSearch
      status={!initialValue ? "error" : null}
      allowClear
      placeholder="Branch"
      name="pos_branch_code"
      initialValue={initialValue}
      onSearch={(e) => loadBranch(e, "search")}
      option={listBranch.map((it) => {
        return {
          text: `(${it.pos_branch_code}) ${it.pos_branch_name}`,
          value: it.pos_branch_code,
          ...it,
        };
      })}
      style={{ width: "250px" }}
      onChange={(val, item) => {
        handleChange(val, item);
      }}
      {...rest}
    />
  );
};
export default XSelectUserBranch;

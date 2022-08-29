import { XSelectSearchForm } from "component";
import { useEffect, useState } from "react";
import { getBranchByUser } from "../resource";

const XSelectUserBranchForm = (props) => {
  const { title, initialValue, onChange, ...rest } = props;
  const [listBranch, setListBranch] = useState([]);
  const [thisVal, setThisVal] = useState(null);

  useEffect(() => {
    setThisVal(initialValue);
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
    setThisVal(val);
    if (onChange) {
      onChange(val, item);
    }
  };

  return (
    <XSelectSearchForm
      status={!thisVal ? "error" : null}
      required
      allowClear
      placeholder="Branch"
      title="Branch"
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
export default XSelectUserBranchForm;

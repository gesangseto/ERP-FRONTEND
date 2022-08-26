import { Button, Input, Modal } from "antd";
import { XSelectSearchForm } from "component";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateFlowApproval } from "resource";
import { getBranchByUser } from "../resource";
// import { updateDepartment } from "resource/administrator/department";

const XSelectUserBranch = (props) => {
  const { title, initialValue, ...rest } = props;
  const [listBranch, setListBranch] = useState([]);

  useEffect(() => {
    console.log(initialValue);
    loadBranch(initialValue);
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

  return (
    <XSelectSearchForm
      allowClear
      required
      title={title || "Branch Code"}
      placeholder="Input search text"
      name="pos_branch_code"
      onSearch={(e) => loadBranch(e)}
      option={listBranch.map((it) => {
        return {
          text: `(${it.pos_branch_code}) ${it.pos_branch_name}`,
          value: it.pos_branch_code,
        };
      })}
      initialValue={initialValue}
      {...rest}
    />
  );
};
export default XSelectUserBranch;

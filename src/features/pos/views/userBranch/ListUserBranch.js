import { Card } from "antd";
import { XButton, XTable, XTableV2 } from "component";
import { defaultFilter } from "constants";
import { deleteBranch, getBranch, getUserBranch } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute } from "helper/utils";
import moment from "moment";
import { toast } from "react-toastify";

const ListUserBranch = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getUserBranch(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action === "delete") {
      let res = await deleteBranch({ pos_branch_id: id });
      if (res) {
        toast.success("Delete successfully");
        loadData();
      }
      return;
    }
    navigate(`${route.path}/${action}/${id}`);
  };
  const handleClickAdd = () => {
    navigate(`${route.path}/create`);
  };
  return (
    <Card
      title={route.name}
      style={{ textTransform: "capitalize" }}
      // extra={
      //   <XButton
      //     popover="Create"
      //     type="create"
      //     onClick={() => handleClickAdd()}
      //   />
      // }
    >
      <XTableV2
        columns={columns()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListUserBranch;

const columns = () => {
  return [
    {
      title: "Branch Code",
      key: "pos_branch_code",
    },
    {
      title: "Branch Name",
      key: "pos_branch_name",
    },
    {
      title: "Username",
      key: "user_name",
    },
    {
      title: "Total User",
      key: "total_user",
    },
    {
      title: "Cashier",
      key: "total_cashier",
    },
    {
      title: "",
      key: "pos_branch_id",
      action: ["update", "read"],
    },
  ];
};

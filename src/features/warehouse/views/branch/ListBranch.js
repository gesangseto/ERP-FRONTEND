import { Card } from "antd";
import { XButton, XTableV2 } from "component";
import { defaultFilter } from "constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute } from "helper/utils";
import { toast } from "react-toastify";
import { deleteBranch, getBranch } from "features/warehouse/resource";

const ListBranch = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getBranch(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action === "delete") {
      let res = await deleteBranch({ wh_mst_branch_id: id });
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
      extra={
        <XButton
          popover="Create"
          type="create"
          onClick={() => handleClickAdd()}
        />
      }
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

export default ListBranch;

const columns = () => {
  return [
    {
      title: "Code",
      key: "wh_mst_branch_code",
    },
    {
      title: "Branch Name",
      key: "wh_mst_branch_name",
    },
    {
      title: "Desc",
      key: "wh_mst_branch_desc",
    },
    {
      title: "Address",
      key: "wh_mst_branch_address",
    },
    {
      title: "Status",
      key: "status",
    },
    {
      title: "",
      key: "wh_mst_branch_id",
      action: ["approve", "delete", "update", "read"],
    },
  ];
};

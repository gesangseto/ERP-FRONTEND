import { Card } from "antd";
import { XButton, XTable } from "component";
import { defaultFilter } from "constants";
import { deleteBranch, getBranch } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute } from "helper/utils";
import moment from "moment";
import { toast } from "react-toastify";

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
      extra={
        <XButton
          popover="Create"
          type="create"
          onClick={() => handleClickAdd()}
        />
      }
    >
      <XTable
        rowKey="pos_branch_id"
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
      title: "Date",
      key: "created_at",
      render: (i, rec) => <p>{moment(i).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },
    {
      title: "Desc",
      key: "pos_branch_desc",
    },
    {
      title: "Branch Name",
      key: "pos_branch_name",
    },
    {
      title: "Address",
      key: "pos_branch_address",
    },
    {
      title: "Phone",
      key: "pos_branch_phone",
    },
    {
      title: "Status",
      key: "status",
      render: (i, rec) => (
        <p
          style={{
            color: rec.status == 1 ? "green" : "red",
          }}
        >
          {rec.status == 1 ? "Active" : "Inactive"}
        </p>
      ),
    },
    {
      title: "",
      key: "pos_branch_id",
      action: ["approve", "delete", "update", "read"],
    },
  ];
};

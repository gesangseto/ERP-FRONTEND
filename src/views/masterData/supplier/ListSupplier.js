import { Card, Tag } from "antd";
import { XButton, XTableV2 } from "component";
import { defaultFilter } from "constants";
import { getRoute } from "helper/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteSupplier, getSupplier } from "resource";

const ListSupplier = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getSupplier(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action == "delete") {
      if (await deleteSupplier({ mst_supplier_id: id })) {
        loadData();
        toast.success(`Delete id ${id} successfully`);
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

export default ListSupplier;

const columns = () => {
  return [
    {
      title: "ID",
      key: "mst_supplier_id",
    },
    {
      title: "PIC",
      key: "mst_supplier_pic",
    },
    {
      title: "Name",
      key: "mst_supplier_name",
    },
    {
      title: "Email",
      key: "mst_supplier_email",
    },
    {
      title: "Phone",
      key: "mst_supplier_phone",
    },
    {
      title: "Address",
      key: "mst_supplier_address",
    },
    {
      title: "Status",
      cell: (row) => {
        return (
          <Tag color={row.status ? "green" : "red"}>
            {row.status ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "mst_supplier_id",
      action: ["approve", "update", "read", "delete"],
    },
  ];
};

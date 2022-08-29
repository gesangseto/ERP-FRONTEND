import { Card } from "antd";
import { XTableV2 } from "component";
import { defaultFilter } from "constants";
import { getStockByUser } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute } from "helper/utils";

const ListStock = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getStockByUser(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    navigate(`${route.path}/${action}/${id}`);
  };
  const handleClickAdd = () => {
    navigate(`${route.path}/create`);
  };
  return (
    <Card title={route.name} style={{ textTransform: "capitalize" }}>
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

export default ListStock;

const columns = () => {
  return [
    {
      title: "Branch",
      key: "pos_branch_code",
    },
    {
      title: "Product",
      key: "mst_item_name",
    },
    {
      title: "Item No",
      key: "mst_item_no",
    },
    {
      title: "Desc",
      key: "mst_item_desc",
    },
    {
      title: "Barcode",
      key: "barcode",
    },
    {
      title: "Variant",
      key: "mst_item_variant_name",
    },
    {
      title: "Price",
      key: "price",
    },
    {
      title: "Quantity",
      key: "qty",
    },
    {
      title: "",
      key: "pos_item_stock_id",
      action: ["read"],
    },
  ];
};

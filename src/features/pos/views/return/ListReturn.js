import { Button, Card, Modal, Tag } from "antd";
import { XButton, XSelectSearchForm, XTable, XTableV2 } from "component";
import { defaultFilter } from "constants";
import {
  getReturnByUser,
  getSaleByUser,
  insertReturn,
} from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute, numberWithComma, toDate } from "helper/utils";
import moment from "moment";
import { toast } from "react-toastify";

const ListReturn = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [listSale, setListSale] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [formData, setFormData] = useState({ pos_trx_sale_id: null });
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getReturnByUser(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const loadSale = async (e) => {
    let filter = { page: 1, limit: 10, search: e };
    let _data = await getSaleByUser(filter);
    if (_data) {
      setListSale([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    navigate(`${route.path}/${action}/${id}`);
  };

  const handleClickAdd = () => {
    setModalAdd(true);
    // navigate(`${route.path}/create`);
  };

  const handleClickReturn = async () => {
    let _res = await insertReturn({
      pos_trx_sale_id: formData.pos_trx_sale_id,
    });
    if (_res) {
      toast.success("Success return data");
      setModalAdd(false);
      loadData();
    }
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

      <Modal
        title="Return Form"
        visible={modalAdd}
        onCancel={() => setModalAdd(false)}
        // onOk={hideModal}
        okText="Approve"
        footer={[
          <Button
            key="Return"
            type="success"
            onClick={() => handleClickReturn()}
          >
            Return
          </Button>,
        ]}
      >
        <p>
          The applicant tries to open a dialog to return invoice on your own
          responsibility.
        </p>
        <XSelectSearchForm
          allowClear
          required
          title="Invoice"
          placeholder="input search text"
          name="pos_trx_sale_id"
          onSearch={(e) => loadSale(e)}
          option={listSale.map((it) => {
            return {
              text: `(${it.pos_trx_sale_id}) ${moment(it.created_at).format(
                "YY/MM/DD HH:mm:ss"
              )}`,
              value: it.pos_trx_sale_id,
            };
          })}
          onChange={(val) => setFormData({ ...formData, pos_trx_sale_id: val })}
          initialValue={formData.pos_trx_sale_id}
          status={!formData.pos_trx_sale_id ? "error" : null}
        />
      </Modal>
    </Card>
  );
};

export default ListReturn;

const columns = () => {
  return [
    {
      title: "Branch",
      key: "pos_branch_code",
    },
    {
      title: "INVOICE",
      key: "pos_trx_sale_id",
    },
    {
      title: "Date",
      key: "created_at",
      cell: (it) => toDate(it.created_at),
    },
    {
      title: "Created By",
      key: "user_name",
    },
    {
      title: "Customer",
      key: "mst_customer_name",
    },
    {
      title: "Phone",
      key: "mst_customer_phone",
    },
    {
      title: "Total Price",
      key: "total_price",
      cell: (it) => <>{numberWithComma(it.total_price)}</>,
    },
    {
      title: "PPN (%)",
      key: "ppn",
      cell: (it) => it.ppn ?? 0,
    },
    {
      title: "Discount (%)",
      key: "total_discount",
      cell: (it) => it.total_discount ?? 0,
    },
    {
      title: "Grand Total",
      key: "grand_total",
      cell: (it) => numberWithComma(it.grand_total),
    },
    {
      title: "Status",
      key: "status",
    },
    {
      title: "Return Status",
      key: "is_returned",
      cell: (rec) => {
        let color = "yellow";
        let title = "Not Returned";
        if (rec.is_returned) {
          color = "green";
          title = "Returned";
        } else if (rec.is_returned == false) {
          color = "red";
          title = "Rejected";
        }
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "",
      key: "pos_trx_return_id",
      action: ["approve", "update", "read"],
    },
  ];
};

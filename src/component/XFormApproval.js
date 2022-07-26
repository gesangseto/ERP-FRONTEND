import { Button, Input, Form, Card, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { canApprove } from "../helper/utils";
import { updateFlowApproval } from "../resource";
import XButton from "./XButton";
import XModalApproval from "./XModalApproval";
// import { updateDepartment } from "../../../resource/administrator/department";

const XFormApproval = (props) => {
  const { item, onApprove } = props;
  const [openApproval, setOpenApproval] = useState(false);
  const [data, setData] = useState({
    approval_ref_table: "",
    approval_desc: "",
    approval_user_id_1: "",
    approval_user_id_2: "",
    approval_user_id_3: "",
    approval_user_id_4: "",
    approval_user_id_5: "",
    approval_ref_id: "9",
    rejected_note: "",
    approval_current_user_id: "",
    approval_flow_id: "",
    is_approve: true,
    approval_user_name: "",
    approval_user_email: "",
  });

  useEffect(() => {
    if (item.hasOwnProperty("approval")) {
      let app = item.approval;
      if (app) {
        if (!canApprove(app)) {
          delete app.approval_flow_id;
        }
        setData({ ...app });
      }
    }
  }, [item]);

  return (
    <>
      {data.approval_flow_id ? (
        <Card style={{ margin: 10 }}>
          <h3>Approval Data</h3>
          <Row style={{ margin: 10 }}>
            <Col span={11}>
              <label>Approval Flow</label>
              <Input value={`${data.approval_desc ?? ""}`} />
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <label>Approval Status</label>
              <Input
                value={
                  data.is_approve == null
                    ? "Pending"
                    : data.is_approve
                    ? "Approved"
                    : "Rejected"
                }
              />
            </Col>
          </Row>
          <Row style={{ margin: 10 }}>
            <Col span={11}>
              <label>Approval By</label>
              <Input value={data.approval_user_email} />
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <label>Noted</label>
              <Input value={data.rejected_note} />
            </Col>
          </Row>

          {data.approval_flow_id ? (
            <XButton
              title="Approve"
              use_permission={"false"}
              onClick={() => setOpenApproval(true)}
            />
          ) : null}
          <XModalApproval
            visible={openApproval}
            approval_flow_id={data.approval_flow_id}
            onCancel={() => setOpenApproval(false)}
            onApprove={() => {
              setOpenApproval(false);
              onApprove ? onApprove() : null;
            }}
          />
        </Card>
      ) : null}
    </>
  );
};
export default XFormApproval;

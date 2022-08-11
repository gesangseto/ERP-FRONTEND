import { Button, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateFlowApproval } from "resource";
// import { updateDepartment } from "resource/administrator/department";

const XModalApproval = (props) => {
  const { approval_flow_id, item, onApprove, showDetail = false } = props;
  const [formData, setFormData] = useState({
    approval_flow_id: null,
    is_approve: null,
    rejected_note: "",
  });

  useEffect(() => {
    setFormData({ ...formData, approval_flow_id: approval_flow_id });
  }, [approval_flow_id]);

  const showModal = () => {
    setFormData({ ...formData, approval_flow_id: 1 });
  };

  const hideModal = () => {
    setFormData({ ...formData, approval_flow_id: null });
  };

  const handleApprove = async (type) => {
    let param = formData;
    param.is_approve = type == "approve" ? true : false;
    let _res = await updateFlowApproval(param);
    if (_res) {
      toast.success(`${type} is success`);
      hideModal();
    }
    if (onApprove) {
      onApprove();
    }
  };
  return (
    <>
      <Modal
        title="Approval Form"
        visible={formData.approval_flow_id}
        onOk={hideModal}
        okText="Approve"
        footer={[
          <Button
            key="Reject"
            type="danger"
            onClick={() => handleApprove("reject")}
          >
            Reject
          </Button>,
          <Button
            key="Approve"
            type="success"
            onClick={() => handleApprove("approve")}
          >
            Approve
          </Button>,
        ]}
        {...props}
      >
        <p>
          The applicant tries to open a dialog to approve or reject data on your
          own responsibility.
        </p>
        <Input
          onChange={(e) =>
            setFormData({ ...formData, rejected_note: e.target.value })
          }
          placeholder="Note"
          name="rejected_note"
        />
      </Modal>
    </>
  );
};
export default XModalApproval;

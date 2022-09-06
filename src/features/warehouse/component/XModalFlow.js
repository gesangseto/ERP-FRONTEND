import { Modal } from "antd";
import { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, MarkerType } from "react-flow-renderer";
import { getWhType } from "../resource";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
  },

  {
    id: "2",
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node" },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

const XModalFlow = (props) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let _data = await getWhType();
    console.log(_data.data);
    console.log(initialNodes);
    console.log("========================");
  };

  return (
    <>
      <Modal
        title="Form Cashier"
        okText="Approve"
        footer={null}
        width={1000}
        {...props}
      >
        <div style={{ height: 500, width: 1000 }}>
          <ReactFlow
            defaultNodes={nodes}
            defaultEdges={edges}
            onNodeDragStop={(e, data) => console.log("nodes", e, data)}
            onEdgesChange={(e) => console.log("edges", e)}
            onConnect={(e) => console.log("connect", e)}
          >
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </Modal>
    </>
  );
};

export default XModalFlow;

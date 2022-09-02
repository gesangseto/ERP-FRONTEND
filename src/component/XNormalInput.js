import React from "react";

const XNormalInput = React.forwardRef((props, ref) => {
  const { status, ...rest } = props;
  return (
    <>
      <input ref={ref} style={{ height: 30, borderColor: "gray" }} {...rest} />
    </>
  );
});

export default XNormalInput;

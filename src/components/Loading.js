import React from "react";

function Loading() {
  return (
    <div style={{ position: "relative" }}>
      <h2
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        loading....
      </h2>
    </div>
  );
}

export default Loading;

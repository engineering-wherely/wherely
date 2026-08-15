"use client";

import { createPortal } from "react-dom";

export default function Page() {
  return (
    <div style={{ border: "2px solid white" }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body,
      )}
    </div>
  );
}

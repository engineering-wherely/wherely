"use client";

import NoPortalExample from "./components/NoPortalExample";
import PortalExample from "./components/PortalExample";

export default function App() {
  return (
    <>
      <div className="w-100 h-30 pl-2 pt-2 border mb-2 overflow-hidden">
        <NoPortalExample />
      </div>
      <div className="w-100 h-30 pl-2 pt-2 border mb-2 overflow-hidden">
        <PortalExample />
      </div>
    </>
  );
}

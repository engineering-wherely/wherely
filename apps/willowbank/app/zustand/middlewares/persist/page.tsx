"use client";

import { useEffect, useRef } from "react";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

type PositionStoreState = { position: { x: number; y: number } };

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState["position"]) => void;
};

type PositionStore = PositionStoreState & PositionStoreActions;

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    { name: "position-storage" },
  ),
);

export default function Page() {
  const dotContainer = useRef<HTMLDivElement | null>(null);

  const position = useStore(positionStore, (s) => s.position);
  const setPosition = useStore(positionStore, (s) => s.setPosition);

  useEffect(() => {
    const container = dotContainer.current;

    const handlePointerMove = (event: HTMLElementEventMap["pointermove"]) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    container?.addEventListener("pointermove", handlePointerMove);

    return () => {
      container?.removeEventListener("pointermove", handlePointerMove);
    };
  }, [setPosition]);

  return (
    <div
      className="relative w-screen h-screen bg-emerald-600"
      ref={dotContainer}
    >
      <div
        className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600"
        style={{
          left: position.x,
          top: position.y,
        }}
      />
    </div>
  );
}

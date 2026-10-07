"use client";

import { addToCart, removeFromCart } from "@/app/hooks/use-action-state/api";
import "@/app/hooks/use-action-state/checkout.css";
import Total from "@/app/hooks/use-action-state/Total";
import { useActionState, useRef } from "react";
import QuantityStepper from "./QuantityStepper";

export default function Checkout() {
  const abortRef = useRef<AbortController>(null);
  const [count, dispatchAction, isPending] = useActionState(
    updateCartAction,
    0,
  );

  function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    dispatchAction({ type: "ADD", signal: abortRef.current.signal });
  }

  function removeAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    dispatchAction({ type: "REMOVE", signal: abortRef.current.signal });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(
  prevCount: number,
  actionPayload: { type: "ADD" | "REMOVE"; signal: AbortSignal },
) {
  switch (actionPayload.type) {
    case "ADD": {
      try {
        return await addToCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return prevCount + 1;
      }
    }
    case "REMOVE": {
      try {
        return await removeFromCart(prevCount, {
          signal: actionPayload.signal,
        });
      } catch (e) {
        return Math.max(0, prevCount - 1);
      }
    }
  }
  return prevCount;
}

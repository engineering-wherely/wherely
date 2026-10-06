"use client";

import { addToCart, removeFromCart } from "@/app/hooks/use-action-state/api";
import "@/app/hooks/use-action-state/checkout.css";
import Total from "@/app/hooks/use-action-state/Total";
import { startTransition, useActionState } from "react";

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(
    updateCartAction,
    0,
  );

  function handleAdd() {
    startTransition(() => {
      dispatchAction({ type: "ADD" });
    });
  }

  function handleRemove() {
    startTransition(() => {
      dispatchAction({ type: "REMOVE" });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="qty">{isPending ? "🌀" : count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(
  prevCount: number,
  actionPayload: { type: "ADD" | "REMOVE" },
) {
  switch (actionPayload.type) {
    case "ADD": {
      return await addToCart(prevCount);
    }
    case "REMOVE": {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}

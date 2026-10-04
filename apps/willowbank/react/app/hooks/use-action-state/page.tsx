"use client";

import { addToCart } from "@/app/hooks/use-action-state/api";
import "@/app/hooks/use-action-state/checkout.css";
import Total from "@/app/hooks/use-action-state/Total";
import { startTransition, useActionState } from "react";

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(
    async (prevCount) => {
      return await addToCart(prevCount);
    },
    0,
  );

  function handleClick() {
    startTransition(() => {
      dispatchAction();
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>Qty: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>Add Ticket{isPending ? "🌀" : ""}</button>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}

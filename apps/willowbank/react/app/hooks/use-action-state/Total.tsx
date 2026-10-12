const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

export default function Total({
  quantity,
  isPending,
}: {
  quantity: number;
  isPending: boolean;
}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? "🌀 Updating..." : formatter.format(quantity * 9999)}
    </div>
  );
}

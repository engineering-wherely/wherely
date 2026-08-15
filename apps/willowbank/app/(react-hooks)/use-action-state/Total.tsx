import styles from "./page.module.css";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

export default function Total({ quantity }: { quantity: number }) {
  return (
    <div className={`${styles.row} ${styles.total}`}>
      <span>Total</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}

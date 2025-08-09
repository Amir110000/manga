export function formatCurrencyFa(amount: number): string {
  const nf = new Intl.NumberFormat("fa-IR");
  return nf.format(amount) + " تومان";
}

export function toFaDigits(value: number | string): string {
  const nf = new Intl.NumberFormat("fa-IR");
  const num = typeof value === "number" ? value : Number(value);
  return nf.format(num);
}
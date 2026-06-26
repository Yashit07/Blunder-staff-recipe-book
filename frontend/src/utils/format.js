// Shared formatting utilities for Blunder

export const formatQty = (n) => {
  if (!Number.isFinite(n)) return n;
  const rounded = Math.round(n * 10) / 10;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
};

export const formatMoney = (n, currency = "$") => {
  if (!Number.isFinite(n)) return `${currency}0.00`;
  return `${currency}${n.toFixed(2)}`;
};

export const formatDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

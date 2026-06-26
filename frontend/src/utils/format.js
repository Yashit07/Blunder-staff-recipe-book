// Shared formatting utilities for Blunder

export const formatQty = (n) => {
  if (!Number.isFinite(n)) return n;
  const rounded = Math.round(n * 10) / 10;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
};

export const applyRounding = (n, rounding = "none") => {
  if (!Number.isFinite(n)) return 0;
  switch (rounding) {
    case "1":
      return Math.round(n);
    case "0.5":
      return Math.round(n * 2) / 2;
    case "0.1":
      return Math.round(n * 10) / 10;
    case "5":
      return Math.round(n / 5) * 5;
    case "10":
      return Math.round(n / 10) * 10;
    case "none":
    default:
      return n;
  }
};

export const formatMoney = (n, currency = "₹", rounding = "none") => {
  const v = applyRounding(Number.isFinite(n) ? n : 0, rounding);
  // Whole-number rounding shows no decimals
  if (rounding === "1" || rounding === "5" || rounding === "10") {
    return `${currency}${v.toFixed(0)}`;
  }
  if (rounding === "0.5") {
    return `${currency}${v.toFixed(2).replace(/0$/, "0")}`;
  }
  if (rounding === "0.1") {
    return `${currency}${v.toFixed(1)}`;
  }
  return `${currency}${v.toFixed(2)}`;
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

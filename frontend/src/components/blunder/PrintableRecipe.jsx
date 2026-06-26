import React from "react";
import { SIZE_RATIOS } from "../../data/seedData";
import { formatQty, formatMoney, formatDate } from "../../utils/format";

// Renders a clean printable version of a single recipe at a given size.
// Visible only via @media print (controlled by parent via .print-target wrapper).
export const PrintableRecipe = ({ item, size = "Medium", currency = "₹", rounding = "none" }) => {
  if (!item) return null;
  const ratio = SIZE_RATIOS[size] ?? 1;
  const scaled = item.ingredients.map((i) => ({
    ...i,
    scaledAmount: i.amount * ratio,
    lineCost: (Number(i.amount) || 0) * ratio * (Number(i.costPerUnit) || 0),
  }));
  const ingCost = scaled.reduce((s, i) => s + i.lineCost, 0);
  const pkgCost = (item.packaging || []).reduce(
    (s, p) => s + (Number(p.cost) || 0),
    0
  );
  const total = ingCost + pkgCost;
  const hasCost = ingCost > 0 || pkgCost > 0;
  const salePrice = Number(item.salePrice) || 0;

  return (
    <div className="print-recipe">
      <header className="print-header">
        <div className="print-brand">blunder · staff recipe</div>
        <div className="print-meta">
          <span>Size: {size}</span>
          <span>·</span>
          <span>Printed: {new Date().toLocaleDateString()}</span>
        </div>
      </header>
      <h1 className="print-title">{item.name}</h1>
      <div className="print-category">{item.category}</div>
      {item.description && <p className="print-desc">{item.description}</p>}

      <section className="print-section">
        <h2 className="print-h2">Ingredients</h2>
        <table className="print-table">
          <tbody>
            {scaled.map((ing) => (
              <tr key={ing.id}>
                <td>{ing.name}</td>
                <td className="print-num">
                  {formatQty(ing.scaledAmount)} {ing.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-section">
        <h2 className="print-h2">Preparation</h2>
        <ol className="print-steps">
          {item.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      {(item.packaging || []).length > 0 && (
        <section className="print-section">
          <h2 className="print-h2">Packaging</h2>
          <table className="print-table">
            <tbody>
              {item.packaging.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="print-num">{formatMoney(p.cost, currency, rounding)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {hasCost && (
        <section className="print-section">
          <h2 className="print-h2">Cost Estimate ({size})</h2>
          <table className="print-table">
            <tbody>
              <tr>
                <td>Ingredients</td>
                <td className="print-num">{formatMoney(ingCost, currency, rounding)}</td>
              </tr>
              {pkgCost > 0 && (
                <tr>
                  <td>Packaging</td>
                  <td className="print-num">{formatMoney(pkgCost, currency, rounding)}</td>
                </tr>
              )}
              <tr className="print-total">
                <td>Cost Total</td>
                <td className="print-num">{formatMoney(total, currency, rounding)}</td>
              </tr>
              {salePrice > 0 && (
                <>
                  <tr>
                    <td>Sale Price</td>
                    <td className="print-num">{formatMoney(salePrice, currency, rounding)}</td>
                  </tr>
                  <tr>
                    <td>Profit · Margin</td>
                    <td className="print-num">
                      {formatMoney(salePrice - total, currency, rounding)} ·{" "}
                      {(((salePrice - total) / salePrice) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </section>
      )}

      {(item.lastEditedBy || item.lastEditedAt) && (
        <footer className="print-footer">
          Last updated{item.lastEditedBy ? ` by ${item.lastEditedBy}` : ""}
          {item.lastEditedAt ? ` · ${formatDate(item.lastEditedAt)}` : ""}
        </footer>
      )}
    </div>
  );
};

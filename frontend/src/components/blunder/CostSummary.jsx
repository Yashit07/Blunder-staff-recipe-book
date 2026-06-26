import React, { useMemo } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { formatMoney, applyRounding } from "../../utils/format";

// scaledIngredients: array with .scaled (amount) and .costPerUnit (per single unit of `unit`)
export const CostSummary = ({
  item,
  scaledIngredients,
  size,
  currency,
  editMode,
  rounding = "none",
  onChange,
}) => {
  const ingredientCost = useMemo(
    () =>
      scaledIngredients.reduce(
        (sum, ing) => sum + (Number(ing.scaled) || 0) * (Number(ing.costPerUnit) || 0),
        0
      ),
    [scaledIngredients]
  );

  const packagingCost = useMemo(
    () => (item.packaging || []).reduce((s, p) => s + (Number(p.cost) || 0), 0),
    [item.packaging]
  );

  const total = ingredientCost + packagingCost;
  const salePrice = Number(item.salePrice) || 0;
  const margin = salePrice > 0 ? ((salePrice - total) / salePrice) * 100 : null;
  const profit = salePrice > 0 ? salePrice - total : null;

  const anyCostSet =
    scaledIngredients.some((i) => Number(i.costPerUnit) > 0) || packagingCost > 0;

  if (!anyCostSet && !editMode) return null;

  return (
    <section
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: "rgba(178, 201, 171, 0.12)",
        border: "1px solid rgba(178, 201, 171, 0.35)",
      }}
      data-testid={`cost-summary-${item.id}`}
    >
      <h3
        className="text-[0.7rem] uppercase tracking-[0.22em] font-bold flex items-center gap-1.5"
        style={{ color: "#5A6E55", fontFamily: "Manrope" }}
      >
        <Calculator size={11} strokeWidth={2.5} />
        Cost Estimate · {size}
      </h3>

      {!anyCostSet ? (
        <p className="text-xs italic" style={{ color: "#7A7A75" }}>
          Add a per-unit cost to any ingredient (in edit mode) to see live cost calculations.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "#7A7A75", fontFamily: "Work Sans" }}>Ingredients</span>
            <span
              className="font-bold tabular-nums"
              style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
              data-testid={`cost-ingredients-${item.id}`}
            >
              {formatMoney(ingredientCost, currency, rounding)}
            </span>
          </div>
          {packagingCost > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#7A7A75", fontFamily: "Work Sans" }}>Packaging</span>
              <span
                className="font-bold tabular-nums"
                style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
                data-testid={`cost-packaging-${item.id}`}
              >
                {formatMoney(packagingCost, currency, rounding)}
              </span>
            </div>
          )}
          <div className="h-px w-full my-1" style={{ background: "rgba(0,0,0,0.08)" }} />
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-[0.2em] font-bold"
              style={{ color: "#5A6E55", fontFamily: "Manrope" }}
            >
              Cost Total
            </span>
            <span
              className="text-xl font-black tabular-nums"
              style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
              data-testid={`cost-total-${item.id}`}
            >
              {formatMoney(total, currency, rounding)}
            </span>
          </div>
        </div>
      )}

      {/* Sale Price */}
      {(editMode || salePrice > 0) && (
        <div
          className="mt-1 pt-3 border-t flex flex-col gap-2"
          style={{ borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-1.5"
              style={{ color: "#5A6E55", fontFamily: "Manrope" }}
            >
              <TrendingUp size={11} strokeWidth={2.5} />
              Sale Price
            </span>
            {editMode ? (
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold" style={{ color: "#7A7A75" }}>
                  {currency}
                </span>
                <input
                  className="edit-field edit-field-num text-sm"
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.salePrice ?? ""}
                  placeholder="0.00"
                  onChange={(e) =>
                    onChange &&
                    onChange({
                      ...item,
                      salePrice:
                        e.target.value === "" ? undefined : parseFloat(e.target.value) || 0,
                    })
                  }
                  data-testid={`sale-price-input-${item.id}`}
                />
              </div>
            ) : (
              <span
                className="text-lg font-black tabular-nums"
                style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
                data-testid={`sale-price-${item.id}`}
              >
                {formatMoney(salePrice, currency, rounding)}
              </span>
            )}
          </div>
          {salePrice > 0 && anyCostSet && (
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "#7A7A75", fontFamily: "Work Sans" }}>
                Profit · Margin
              </span>
              <span
                className="font-bold tabular-nums"
                style={{
                  fontFamily: "Manrope",
                  color: profit >= 0 ? "#5A6E55" : "#C97B6B",
                }}
                data-testid={`margin-${item.id}`}
              >
                {formatMoney(profit, currency, rounding)} ·{" "}
                {applyRounding(margin, "0.1").toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

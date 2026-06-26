import React, { useMemo } from "react";
import { Calculator } from "lucide-react";
import { formatMoney } from "../../utils/format";

// scaledIngredients: array with .scaled (amount) and .costPerUnit (per single unit of `unit`)
export const CostSummary = ({ item, scaledIngredients, size, currency, editMode }) => {
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
      <div className="flex items-center justify-between">
        <h3
          className="text-[0.7rem] uppercase tracking-[0.22em] font-bold flex items-center gap-1.5"
          style={{ color: "#5A6E55", fontFamily: "Manrope" }}
        >
          <Calculator size={11} strokeWidth={2.5} />
          Cost Estimate · {size}
        </h3>
      </div>

      {!anyCostSet ? (
        <p className="text-xs italic" style={{ color: "#7A7A75" }}>
          Add a per-unit cost to any ingredient (in edit mode) to see live cost calculations.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "#7A7A75", fontFamily: "Work Sans" }}>
              Ingredients
            </span>
            <span
              className="font-bold tabular-nums"
              style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
              data-testid={`cost-ingredients-${item.id}`}
            >
              {formatMoney(ingredientCost, currency)}
            </span>
          </div>
          {packagingCost > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#7A7A75", fontFamily: "Work Sans" }}>
                Packaging
              </span>
              <span
                className="font-bold tabular-nums"
                style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
                data-testid={`cost-packaging-${item.id}`}
              >
                {formatMoney(packagingCost, currency)}
              </span>
            </div>
          )}
          <div
            className="h-px w-full my-1"
            style={{ background: "rgba(0,0,0,0.08)" }}
          />
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-[0.2em] font-bold"
              style={{ color: "#5A6E55", fontFamily: "Manrope" }}
            >
              Total Cost
            </span>
            <span
              className="text-xl font-black tabular-nums"
              style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
              data-testid={`cost-total-${item.id}`}
            >
              {formatMoney(total, currency)}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

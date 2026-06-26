import React from "react";
import { Plus, Minus, Package } from "lucide-react";
import { formatMoney } from "../../utils/format";

export const PackagingSection = ({ item, editMode, onChange, currency }) => {
  const packaging = item.packaging || [];

  if (!editMode && packaging.length === 0) return null;

  const update = (next) => onChange({ ...item, packaging: next });

  const addItem = () =>
    update([
      ...packaging,
      { id: `pkg-${Date.now()}`, name: "Packaging item", cost: 0 },
    ]);

  const updateItem = (idx, patch) => {
    const next = [...packaging];
    next[idx] = { ...next[idx], ...patch };
    update(next);
  };

  const removeItem = (idx) => update(packaging.filter((_, i) => i !== idx));

  return (
    <section className="flex flex-col gap-2.5" data-testid={`packaging-section-${item.id}`}>
      <div className="flex items-center justify-between">
        <h3
          className="text-[0.7rem] uppercase tracking-[0.22em] font-bold flex items-center gap-1.5"
          style={{ color: "#7A7A75", fontFamily: "Manrope" }}
        >
          <Package size={11} strokeWidth={2.5} />
          Packaging
        </h3>
        {editMode && (
          <button
            onClick={addItem}
            className="text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-black/5 transition"
            style={{ color: "#5A6E55", fontFamily: "Manrope" }}
            data-testid={`packaging-add-${item.id}`}
          >
            <Plus size={13} strokeWidth={2.5} />
            Add
          </button>
        )}
      </div>

      {packaging.length === 0 && editMode && (
        <p className="text-xs italic px-3" style={{ color: "#7A7A75" }}>
          No packaging added yet. Click "Add" to include cups, lids, sleeves, etc.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {packaging.map((pkg, idx) => (
          <li
            key={pkg.id}
            className="flex items-center justify-between gap-3 py-1.5 px-3 rounded-xl"
            style={{ background: idx % 2 === 0 ? "rgba(255,255,255,0.5)" : "transparent" }}
            data-testid={`packaging-row-${item.id}-${idx}`}
          >
            {editMode ? (
              <>
                <input
                  className="edit-field text-sm flex-1"
                  value={pkg.name}
                  onChange={(e) => updateItem(idx, { name: e.target.value })}
                  data-testid={`packaging-name-${item.id}-${idx}`}
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: "#7A7A75" }}>
                    {currency}
                  </span>
                  <input
                    className="edit-field edit-field-num text-sm"
                    type="number"
                    step="0.01"
                    min="0"
                    value={pkg.cost}
                    onChange={(e) =>
                      updateItem(idx, { cost: parseFloat(e.target.value) || 0 })
                    }
                    data-testid={`packaging-cost-${item.id}-${idx}`}
                  />
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-black/5"
                  style={{ color: "#C97B6B" }}
                  aria-label="Remove packaging"
                  data-testid={`packaging-remove-${item.id}-${idx}`}
                >
                  <Minus size={14} />
                </button>
              </>
            ) : (
              <>
                <span
                  className="text-sm flex-1"
                  style={{ fontFamily: "Work Sans", color: "#2C2C2A" }}
                >
                  {pkg.name}
                </span>
                <span
                  className="font-bold text-sm tabular-nums"
                  style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
                >
                  {formatMoney(pkg.cost, currency)}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

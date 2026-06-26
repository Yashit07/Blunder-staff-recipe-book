import React, { useMemo, useState, useEffect, useRef } from "react";
import { Trash2, Plus, Minus, GripVertical } from "lucide-react";
import { SizeToggle } from "./SizeToggle";
import { SIZE_RATIOS } from "../../data/seedData";

const formatQty = (n) => {
  if (Number.isFinite(n)) {
    // Round to one decimal, drop trailing .0
    const rounded = Math.round(n * 10) / 10;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
  }
  return n;
};

const PulseQty = ({ value, unit }) => {
  const [animKey, setAnimKey] = useState(0);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setAnimKey((k) => k + 1);
  }, [value]);
  return (
    <span
      key={animKey}
      className="qty-animate font-bold tabular-nums"
      style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
    >
      {formatQty(value)}
      <span className="text-xs ml-0.5" style={{ color: "#7A7A75", fontWeight: 600 }}>
        {unit}
      </span>
    </span>
  );
};

export const MenuCard = ({
  item,
  editMode,
  onChange,
  onDelete,
}) => {
  const [size, setSize] = useState("Medium");
  const ratio = SIZE_RATIOS[size];

  const scaledIngredients = useMemo(
    () =>
      item.ingredients.map((ing) => ({
        ...ing,
        scaled: ing.amount * ratio,
      })),
    [item.ingredients, ratio]
  );

  // Editing helpers
  const update = (patch) => onChange({ ...item, ...patch });

  const updateIngredient = (idx, patch) => {
    const next = [...item.ingredients];
    next[idx] = { ...next[idx], ...patch };
    update({ ingredients: next });
  };

  const addIngredient = () => {
    update({
      ingredients: [
        ...item.ingredients,
        { id: `i-${Date.now()}`, name: "New ingredient", amount: 10, unit: "g" },
      ],
    });
  };

  const removeIngredient = (idx) => {
    const next = item.ingredients.filter((_, i) => i !== idx);
    update({ ingredients: next });
  };

  const updateStep = (idx, value) => {
    const next = [...item.steps];
    next[idx] = value;
    update({ steps: next });
  };

  const addStep = () => update({ steps: [...item.steps, "New step"] });
  const removeStep = (idx) =>
    update({ steps: item.steps.filter((_, i) => i !== idx) });

  return (
    <article
      className="neuro-card p-6 sm:p-7 flex flex-col gap-5 fade-rise relative"
      data-testid={`menu-card-${item.id}`}
    >
      {editMode && (
        <button
          onClick={() => onDelete(item.id)}
          className="absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: "#F4F3EF",
            boxShadow: "3px 3px 7px #e5e4e0, -3px -3px 7px #ffffff",
            color: "#C97B6B",
          }}
          aria-label="Delete item"
          data-testid={`menu-card-delete-${item.id}`}
        >
          <Trash2 size={16} strokeWidth={2.3} />
        </button>
      )}

      {/* Header */}
      <header className="flex flex-col gap-2 pr-10">
        <div className="flex items-center gap-2">
          {editMode ? (
            <input
              className="edit-field text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "Manrope" }}
              value={item.category}
              onChange={(e) => update({ category: e.target.value })}
              data-testid={`menu-card-category-${item.id}`}
            />
          ) : (
            <span
              className="text-[0.65rem] uppercase tracking-[0.22em] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: "#B2C9AB33",
                color: "#5A6E55",
                fontFamily: "Manrope",
              }}
              data-testid={`menu-card-category-${item.id}`}
            >
              {item.category}
            </span>
          )}
        </div>
        {editMode ? (
          <input
            className="edit-field text-2xl sm:text-3xl font-black tracking-tight"
            style={{ fontFamily: "Manrope" }}
            value={item.name}
            onChange={(e) => update({ name: e.target.value })}
            data-testid={`menu-card-name-${item.id}`}
          />
        ) : (
          <h2
            className="text-2xl sm:text-[1.65rem] font-black tracking-tight leading-tight"
            style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
            data-testid={`menu-card-name-${item.id}`}
          >
            {item.name}
          </h2>
        )}
        {editMode ? (
          <textarea
            className="edit-field text-sm"
            rows={2}
            value={item.description || ""}
            onChange={(e) => update({ description: e.target.value })}
            data-testid={`menu-card-desc-${item.id}`}
          />
        ) : (
          item.description && (
            <p className="text-sm" style={{ color: "#7A7A75" }}>
              {item.description}
            </p>
          )
        )}
      </header>

      {/* Size toggle */}
      <SizeToggle value={size} onChange={setSize} itemId={item.id} />

      {/* Ingredients */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3
            className="text-[0.7rem] uppercase tracking-[0.22em] font-bold"
            style={{ color: "#7A7A75", fontFamily: "Manrope" }}
          >
            Ingredients · {size}
          </h3>
          {editMode && (
            <button
              onClick={addIngredient}
              className="text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-black/5 transition"
              style={{ color: "#5A6E55", fontFamily: "Manrope" }}
              data-testid={`menu-card-add-ingredient-${item.id}`}
            >
              <Plus size={13} strokeWidth={2.5} />
              Add
            </button>
          )}
        </div>
        <ul className="flex flex-col gap-2">
          {scaledIngredients.map((ing, idx) => (
            <li
              key={ing.id}
              className="flex items-center justify-between gap-3 py-1.5 px-3 rounded-xl"
              style={{ background: idx % 2 === 0 ? "rgba(255,255,255,0.5)" : "transparent" }}
              data-testid={`ingredient-row-${item.id}-${idx}`}
            >
              {editMode ? (
                <>
                  <div className="flex items-center gap-2 flex-1">
                    <GripVertical size={14} style={{ color: "#7A7A75", opacity: 0.5 }} />
                    <input
                      className="edit-field text-sm"
                      value={ing.name}
                      onChange={(e) => updateIngredient(idx, { name: e.target.value })}
                      data-testid={`ingredient-name-${item.id}-${idx}`}
                    />
                  </div>
                  <input
                    className="edit-field edit-field-num text-sm"
                    type="number"
                    step="0.1"
                    value={ing.amount}
                    onChange={(e) =>
                      updateIngredient(idx, { amount: parseFloat(e.target.value) || 0 })
                    }
                    data-testid={`ingredient-amount-${item.id}-${idx}`}
                  />
                  <input
                    className="edit-field text-sm"
                    style={{ width: "3.5rem", textAlign: "center" }}
                    value={ing.unit}
                    onChange={(e) => updateIngredient(idx, { unit: e.target.value })}
                    data-testid={`ingredient-unit-${item.id}-${idx}`}
                  />
                  <button
                    onClick={() => removeIngredient(idx)}
                    className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-black/5"
                    style={{ color: "#C97B6B" }}
                    aria-label="Remove ingredient"
                    data-testid={`ingredient-remove-${item.id}-${idx}`}
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
                    {ing.name}
                  </span>
                  <span data-testid={`ingredient-qty-${item.id}-${idx}`}>
                    <PulseQty value={ing.scaled} unit={ing.unit} />
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="h-px w-full" style={{ background: "rgba(0,0,0,0.06)" }} />

      {/* Steps */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3
            className="text-[0.7rem] uppercase tracking-[0.22em] font-bold"
            style={{ color: "#7A7A75", fontFamily: "Manrope" }}
          >
            Preparation
          </h3>
          {editMode && (
            <button
              onClick={addStep}
              className="text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-black/5 transition"
              style={{ color: "#5A6E55", fontFamily: "Manrope" }}
              data-testid={`menu-card-add-step-${item.id}`}
            >
              <Plus size={13} strokeWidth={2.5} />
              Add
            </button>
          )}
        </div>
        <ol className="flex flex-col gap-2.5">
          {item.steps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3"
              data-testid={`step-row-${item.id}-${idx}`}
            >
              <span
                className="flex-shrink-0 h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  background: "#B2C9AB",
                  color: "#2C2C2A",
                  fontFamily: "Manrope",
                }}
              >
                {idx + 1}
              </span>
              {editMode ? (
                <div className="flex-1 flex items-start gap-2">
                  <textarea
                    className="edit-field text-sm leading-relaxed"
                    rows={2}
                    value={step}
                    onChange={(e) => updateStep(idx, e.target.value)}
                    data-testid={`step-text-${item.id}-${idx}`}
                  />
                  <button
                    onClick={() => removeStep(idx)}
                    className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-black/5 mt-1"
                    style={{ color: "#C97B6B" }}
                    aria-label="Remove step"
                    data-testid={`step-remove-${item.id}-${idx}`}
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ) : (
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "#2C2C2A", fontFamily: "Work Sans" }}
                >
                  {step}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
};

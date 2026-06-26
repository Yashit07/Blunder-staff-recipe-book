import React from "react";
import { Plus, X } from "lucide-react";

export const CategoryTabs = ({
  categories,
  active,
  onChange,
  editMode = false,
  onAdd,
  onRemove,
  removableSet = [],
}) => {
  const all = ["All", ...categories];
  const removable = new Set(removableSet);
  return (
    <div
      className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 hide-scrollbar items-center"
      data-testid="category-tabs"
    >
      {all.map((cat) => {
        const isActive = active === cat;
        const canRemove = editMode && cat !== "All" && removable.has(cat);
        return (
          <div key={cat} className="relative inline-flex items-center">
            <button
              onClick={() => onChange(cat)}
              className={`whitespace-nowrap px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                isActive ? "neuro-pressed" : "neuro-button"
              } ${canRemove ? "pr-9" : ""}`}
              style={{
                fontFamily: "Manrope",
                color: isActive ? "#2C2C2A" : "#7A7A75",
                background: isActive ? "#F3D89933" : undefined,
              }}
              data-testid={`category-tab-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
            {canRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove && onRemove(cat);
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(201, 123, 107, 0.18)",
                  color: "#C97B6B",
                }}
                aria-label={`Remove ${cat} tab`}
                title={`Remove "${cat}"`}
                data-testid={`category-remove-${cat.toLowerCase()}`}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
        );
      })}
      {editMode && (
        <button
          onClick={onAdd}
          className="neuro-button whitespace-nowrap px-4 py-2.5 text-sm font-bold flex items-center gap-1.5"
          style={{ color: "#5A6E55", fontFamily: "Manrope" }}
          title="Add a new tab / category"
          data-testid="category-add-btn"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add tab
        </button>
      )}
    </div>
  );
};

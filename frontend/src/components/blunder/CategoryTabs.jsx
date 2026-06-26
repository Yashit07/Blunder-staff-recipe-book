import React from "react";

export const CategoryTabs = ({ categories, active, onChange }) => {
  const all = ["All", ...categories];
  return (
    <div
      className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 hide-scrollbar"
      data-testid="category-tabs"
    >
      {all.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`whitespace-nowrap px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
              isActive ? "neuro-pressed" : "neuro-button"
            }`}
            style={{
              fontFamily: "Manrope",
              color: isActive ? "#2C2C2A" : "#7A7A75",
              background: isActive ? "#F3D89933" : undefined,
            }}
            data-testid={`category-tab-${cat.toLowerCase()}`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

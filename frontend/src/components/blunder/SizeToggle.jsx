import React from "react";

const SIZES = ["Regular", "Large"];

export const SizeToggle = ({ value, onChange, itemId }) => {
  return (
    <div
      className="flex p-1 rounded-2xl w-fit"
      style={{
        background: "#F4F3EF",
        boxShadow: "inset 3px 3px 7px #e5e4e0, inset -3px -3px 7px #ffffff",
      }}
      role="tablist"
      data-testid={`size-toggle-${itemId}`}
    >
      {SIZES.map((s) => {
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300"
            style={{
              fontFamily: "Manrope",
              color: active ? "#2C2C2A" : "#7A7A75",
              background: active ? "#B2C9AB" : "transparent",
              boxShadow: active ? "1px 1px 3px rgba(0,0,0,0.08)" : "none",
              cursor: active ? "default" : "pointer",
            }}
            data-testid={`size-toggle-${itemId}-${s.toLowerCase()}`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
};

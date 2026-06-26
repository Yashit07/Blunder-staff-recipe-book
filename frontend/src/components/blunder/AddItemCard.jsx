import React from "react";
import { Plus } from "lucide-react";

export const AddItemCard = ({ onAdd }) => {
  return (
    <button
      onClick={onAdd}
      className="dashed-card p-8 min-h-[280px] flex flex-col items-center justify-center gap-4 w-full"
      data-testid="add-item-card"
    >
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "#F4F3EF",
          boxShadow: "4px 4px 10px #e5e4e0, -4px -4px 10px #ffffff",
        }}
      >
        <Plus size={26} strokeWidth={2.4} style={{ color: "#5A6E55" }} />
      </div>
      <div className="text-center">
        <p
          className="font-extrabold text-lg tracking-tight"
          style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
        >
          Add new recipe
        </p>
        <p className="text-xs mt-1" style={{ color: "#7A7A75" }}>
          Create a fresh menu item with custom ingredients & steps.
        </p>
      </div>
    </button>
  );
};

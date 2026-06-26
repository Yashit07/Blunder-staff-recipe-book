import React from "react";
import { Lock, Unlock, Save } from "lucide-react";

export const Header = ({ editMode, onEditClick, onSaveClick }) => {
  return (
    <header
      className="sticky top-0 z-40 glass-panel"
      style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}
      data-testid="blunder-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-2xl neuro-card flex items-center justify-center"
            style={{ boxShadow: "4px 4px 10px #e5e4e0, -4px -4px 10px #ffffff" }}
          >
            <span
              className="font-black text-xl"
              style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
            >
              b.
            </span>
          </div>
          <div className="leading-tight">
            <h1
              className="font-black text-2xl sm:text-3xl tracking-tighter lowercase"
              style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
              data-testid="brand-wordmark"
            >
              blunder
            </h1>
            <p
              className="text-[0.65rem] uppercase tracking-[0.25em] font-bold"
              style={{ color: "#7A7A75" }}
            >
              Staff Recipe Manual
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editMode ? (
            <button
              onClick={onSaveClick}
              className="neuro-button px-4 sm:px-6 py-2.5 text-sm font-bold flex items-center gap-2"
              style={{ background: "#B2C9AB", color: "#2C2C2A", fontFamily: "Manrope" }}
              data-testid="save-btn"
            >
              <Save size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Save & Lock</span>
              <span className="sm:hidden">Save</span>
            </button>
          ) : (
            <button
              onClick={onEditClick}
              className="neuro-button px-4 sm:px-6 py-2.5 text-sm font-bold flex items-center gap-2"
              style={{ color: "#2C2C2A", fontFamily: "Manrope" }}
              data-testid="edit-mode-btn"
            >
              <Lock size={15} strokeWidth={2.5} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { X, KeyRound } from "lucide-react";

export const PasswordModal = ({ open, onClose, onSuccess }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setValue("");
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (value === "0007") {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 420);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(244, 243, 239, 0.65)", backdropFilter: "blur(12px)" }}
      data-testid="password-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel rounded-3xl p-8 sm:p-10 max-w-sm w-full flex flex-col gap-6 relative fade-rise"
        style={{ transform: shake ? "translateX(0)" : undefined, animation: shake ? "shake 0.4s" : undefined }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-black/5 transition"
          aria-label="Close"
          data-testid="password-modal-close"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "#F4F3EF",
              boxShadow: "inset 3px 3px 6px #e5e4e0, inset -3px -3px 6px #ffffff",
            }}
          >
            <KeyRound size={20} strokeWidth={2.2} style={{ color: "#7A7A75" }} />
          </div>
          <h2
            className="text-2xl font-extrabold tracking-tight"
            style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
          >
            Edit Mode Access
          </h2>
          <p className="text-sm" style={{ color: "#7A7A75" }}>
            Enter the 4-digit staff password to unlock editing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="••••"
            className="w-full text-center text-3xl font-black py-4 rounded-2xl outline-none"
            style={{
              fontFamily: "Manrope",
              letterSpacing: "0.5em",
              color: "#2C2C2A",
              background: "#F4F3EF",
              boxShadow: "inset 4px 4px 8px #e5e4e0, inset -4px -4px 8px #ffffff",
              border: error ? "2px solid #E8B4A2" : "1px solid rgba(0,0,0,0.05)",
            }}
            data-testid="password-input"
            autoComplete="off"
          />
          {error && (
            <p
              className="text-xs text-center font-bold tracking-wider"
              style={{ color: "#C97B6B" }}
              data-testid="password-error"
            >
              INCORRECT PASSWORD — TRY AGAIN
            </p>
          )}
          <button
            type="submit"
            className="neuro-button w-full py-3 font-bold text-sm tracking-wide"
            style={{ background: "#B2C9AB", color: "#2C2C2A", fontFamily: "Manrope" }}
            data-testid="password-submit"
          >
            Unlock
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

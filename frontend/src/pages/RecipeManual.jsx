import React, { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "../components/blunder/Header";
import { PasswordModal } from "../components/blunder/PasswordModal";
import { MenuCard } from "../components/blunder/MenuCard";
import { CategoryTabs } from "../components/blunder/CategoryTabs";
import { AddItemCard } from "../components/blunder/AddItemCard";
import { PrintableRecipe } from "../components/blunder/PrintableRecipe";
import { seedItems, CATEGORIES } from "../data/seedData";
import { Toaster, toast } from "sonner";
import { Search } from "lucide-react";

const STORAGE_KEY = "blunder.menu.v1";
const CURRENCY_KEY = "blunder.currency";
const EDITOR_KEY = "blunder.editor";
const ROUNDING_KEY = "blunder.rounding";

const loadItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedItems;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return seedItems;
  } catch {
    return seedItems;
  }
};

export default function RecipeManual() {
  const [items, setItems] = useState(() => loadItems());
  const [editMode, setEditMode] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState(
    () => localStorage.getItem(CURRENCY_KEY) || "₹"
  );
  const [editor, setEditor] = useState(
    () => localStorage.getItem(EDITOR_KEY) || ""
  );
  const [rounding, setRounding] = useState(
    () => localStorage.getItem(ROUNDING_KEY) || "none"
  );
  const [printJob, setPrintJob] = useState(null); // { item, size }
  const editedIdsRef = useRef(new Set());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency || "₹");
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(ROUNDING_KEY, rounding || "none");
  }, [rounding]);

  const categoriesPresent = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    const ordered = CATEGORIES.filter((c) => set.has(c));
    const extras = [...set].filter((c) => !CATEGORIES.includes(c));
    return [...ordered, ...extras];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (activeCategory !== "All" && it.category !== activeCategory) return false;
      if (!q) return true;
      const hay = `${it.name} ${it.category} ${it.description || ""} ${it.ingredients
        .map((i) => i.name)
        .join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, activeCategory, search]);

  const handleEditClick = () => setPwdOpen(true);

  const handleUnlock = () => {
    setPwdOpen(false);
    // Ask for editor initials once per device
    let who = editor;
    if (!who) {
      const input = window.prompt(
        "Your initials or name (for the edit audit log):",
        ""
      );
      if (input && input.trim()) {
        who = input.trim().slice(0, 24);
        setEditor(who);
        localStorage.setItem(EDITOR_KEY, who);
      }
    }
    editedIdsRef.current = new Set();
    setEditMode(true);
    toast.success("Edit mode unlocked", {
      description: who
        ? `Editing as ${who}. Tap Save when done.`
        : "All fields are now editable. Tap Save when done.",
    });
  };

  const handleSave = () => {
    // Stamp audit info on edited recipes
    if (editedIdsRef.current.size > 0) {
      const nowIso = new Date().toISOString();
      setItems((prev) =>
        prev.map((it) =>
          editedIdsRef.current.has(it.id)
            ? { ...it, lastEditedBy: editor || it.lastEditedBy || "—", lastEditedAt: nowIso }
            : it
        )
      );
    }
    editedIdsRef.current = new Set();
    setEditMode(false);
    toast.success("Changes saved", {
      description: "Edit mode locked. Staff view restored.",
    });
  };

  const handleUpdateItem = (updated) => {
    editedIdsRef.current.add(updated.id);
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  };

  const handleDeleteItem = (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    editedIdsRef.current.delete(id);
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.message("Recipe removed");
  };

  const handleAddItem = () => {
    const id = `itm-${Date.now()}`;
    const newItem = {
      id,
      name: "New Recipe",
      category: activeCategory !== "All" ? activeCategory : "Smoothies",
      description: "Add a short description.",
      ingredients: [
        { id: `i-${Date.now()}-1`, name: "Ingredient 1", amount: 100, unit: "g", costPerUnit: 0 },
        { id: `i-${Date.now()}-2`, name: "Ingredient 2", amount: 50, unit: "ml", costPerUnit: 0 },
      ],
      steps: ["First step.", "Second step."],
      packaging: [],
    };
    editedIdsRef.current.add(id);
    setItems((prev) => [newItem, ...prev]);
  };

  // Export & Import
  const handleExport = () => {
    const payload = {
      brand: "blunder",
      exportedAt: new Date().toISOString(),
      currency,
      items,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blunder-recipes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Recipes exported (JSON)", {
      description: `${items.length} recipes saved to JSON.`,
    });
  };

  const handleExportCSV = () => {
    // Long format: one row per ingredient, plus packaging rows per recipe
    const rows = [
      [
        "Recipe",
        "Category",
        "Section",
        "Item",
        "Amount (Medium)",
        "Unit",
        "Cost per unit",
        "Line cost (Medium)",
        "Sale price",
        "Last edited by",
        "Last edited at",
      ],
    ];
    items.forEach((it) => {
      it.ingredients.forEach((ing) => {
        const line =
          (Number(ing.amount) || 0) * (Number(ing.costPerUnit) || 0);
        rows.push([
          it.name,
          it.category || "",
          "Ingredient",
          ing.name,
          ing.amount,
          ing.unit,
          ing.costPerUnit ?? 0,
          line.toFixed(4),
          it.salePrice ?? "",
          it.lastEditedBy || "",
          it.lastEditedAt || "",
        ]);
      });
      (it.packaging || []).forEach((p) => {
        rows.push([
          it.name,
          it.category || "",
          "Packaging",
          p.name,
          "",
          "",
          "",
          (Number(p.cost) || 0).toFixed(4),
          it.salePrice ?? "",
          it.lastEditedBy || "",
          it.lastEditedAt || "",
        ]);
      });
    });
    const csv = rows
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blunder-recipes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Recipes exported (CSV)", {
      description: `${rows.length - 1} rows written.`,
    });
  };

  const handleImport = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const incoming = Array.isArray(data) ? data : data.items;
      if (!Array.isArray(incoming) || incoming.length === 0) {
        throw new Error("Invalid file: no recipes found.");
      }
      const proceed = window.confirm(
        `Import ${incoming.length} recipes? This will REPLACE all current recipes.`
      );
      if (!proceed) return;
      // Light validation: ensure each has id/name/ingredients/steps
      const cleaned = incoming.map((it, idx) => ({
        id: it.id || `itm-imp-${Date.now()}-${idx}`,
        name: it.name || "Untitled",
        category: it.category || "Smoothies",
        description: it.description || "",
        ingredients: Array.isArray(it.ingredients) ? it.ingredients : [],
        steps: Array.isArray(it.steps) ? it.steps : [],
        packaging: Array.isArray(it.packaging) ? it.packaging : [],
        lastEditedBy: it.lastEditedBy,
        lastEditedAt: it.lastEditedAt,
      }));
      setItems(cleaned);
      if (data.currency) setCurrency(data.currency);
      toast.success("Recipes imported", {
        description: `${cleaned.length} recipes loaded successfully.`,
      });
    } catch (err) {
      toast.error("Import failed", {
        description: err.message || "Invalid JSON file.",
      });
    }
  };

  // Print
  const handlePrint = (item, size) => {
    setPrintJob({ item, size });
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintJob(null), 300);
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(0,0,0,0.06)",
            color: "#2C2C2A",
            fontFamily: "Work Sans",
          },
        }}
      />

      <div className="no-print">
        <Header
          editMode={editMode}
          onEditClick={handleEditClick}
          onSaveClick={handleSave}
          currency={currency}
          onCurrencyChange={setCurrency}
          rounding={rounding}
          onRoundingChange={setRounding}
          onExport={handleExport}
          onExportCSV={handleExportCSV}
          onImport={handleImport}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <section className="mb-10 flex flex-col gap-3 max-w-3xl">
            <span
              className="text-[0.65rem] uppercase tracking-[0.3em] font-bold"
              style={{ color: "#7A7A75" }}
            >
              For staff · v1
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]"
              style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
            >
              recipes,{" "}
              <span style={{ color: "#5A6E55" }}>scaled</span>{" "}
              in a tap.
            </h1>
            <p
              className="text-base sm:text-lg max-w-2xl leading-relaxed"
              style={{ color: "#7A7A75", fontFamily: "Work Sans" }}
            >
              Switch between sizes and ingredient amounts recalculate instantly.
              Edit mode is password-protected so the manual stays consistent across every shift.
            </p>
          </section>

          <section className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <CategoryTabs
                categories={categoriesPresent}
                active={activeCategory}
                onChange={setActiveCategory}
              />
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl w-full sm:w-72"
                style={{
                  background: "#F4F3EF",
                  boxShadow: "inset 3px 3px 7px #e5e4e0, inset -3px -3px 7px #ffffff",
                }}
              >
                <Search size={16} style={{ color: "#7A7A75" }} />
                <input
                  type="text"
                  placeholder="Search recipes or ingredients"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-0 outline-none w-full text-sm"
                  style={{ fontFamily: "Work Sans", color: "#2C2C2A" }}
                  data-testid="search-input"
                />
              </div>
            </div>
          </section>

          <section
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 lg:gap-9"
            data-testid="recipe-grid"
          >
            {filtered.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                editMode={editMode}
                onChange={handleUpdateItem}
                onDelete={handleDeleteItem}
                onPrint={handlePrint}
                currency={currency}
                rounding={rounding}
              />
            ))}
            {editMode && <AddItemCard onAdd={handleAddItem} />}
          </section>

          {filtered.length === 0 && !editMode && (
            <div className="neuro-card p-10 text-center mt-6" data-testid="empty-state">
              <p
                className="text-lg font-bold"
                style={{ fontFamily: "Manrope", color: "#2C2C2A" }}
              >
                No recipes found.
              </p>
              <p className="text-sm mt-1" style={{ color: "#7A7A75" }}>
                Try a different category or clear your search.
              </p>
            </div>
          )}
        </main>

        {editMode && (
          <div className="edit-floating-pill" data-testid="edit-mode-pill">
            Edit Mode On{editor ? ` · ${editor}` : ""}
          </div>
        )}

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-xs" style={{ color: "#7A7A75" }}>
            blunder · staff recipe manual · keep flavours consistent.
          </p>
        </footer>

        <PasswordModal
          open={pwdOpen}
          onClose={() => setPwdOpen(false)}
          onSuccess={handleUnlock}
        />
      </div>

      {/* Print-only target — hidden on screen, shown in print */}
      {printJob && (
        <div className="print-only">
          <PrintableRecipe
            item={printJob.item}
            size={printJob.size}
            currency={currency}
            rounding={rounding}
          />
        </div>
      )}
    </div>
  );
}

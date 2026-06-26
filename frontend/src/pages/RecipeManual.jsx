import React, { useEffect, useMemo, useState } from "react";
import { Header } from "../components/blunder/Header";
import { PasswordModal } from "../components/blunder/PasswordModal";
import { MenuCard } from "../components/blunder/MenuCard";
import { CategoryTabs } from "../components/blunder/CategoryTabs";
import { AddItemCard } from "../components/blunder/AddItemCard";
import { seedItems, CATEGORIES } from "../data/seedData";
import { Toaster, toast } from "sonner";
import { Search } from "lucide-react";

const STORAGE_KEY = "blunder.menu.v1";

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

  // Persist whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const categoriesPresent = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    // Preserve canonical order, then append any unknowns
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
    setEditMode(true);
    setPwdOpen(false);
    toast.success("Edit mode unlocked", {
      description: "All fields are now editable. Tap Save when done.",
    });
  };

  const handleSave = () => {
    setEditMode(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    toast.success("Changes saved", {
      description: "Edit mode locked. Staff view restored.",
    });
  };

  const handleUpdateItem = (updated) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  };

  const handleDeleteItem = (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.message("Recipe removed");
  };

  const handleAddItem = () => {
    const newItem = {
      id: `itm-${Date.now()}`,
      name: "New Recipe",
      category: activeCategory !== "All" ? activeCategory : "Smoothies",
      description: "Add a short description.",
      ingredients: [
        { id: `i-${Date.now()}-1`, name: "Ingredient 1", amount: 100, unit: "g" },
        { id: `i-${Date.now()}-2`, name: "Ingredient 2", amount: 50, unit: "ml" },
      ],
      steps: ["First step.", "Second step."],
    };
    setItems((prev) => [newItem, ...prev]);
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
      <Header
        editMode={editMode}
        onEditClick={handleEditClick}
        onSaveClick={handleSave}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero / intro */}
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

        {/* Controls */}
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

        {/* Grid */}
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
            />
          ))}
          {editMode && <AddItemCard onAdd={handleAddItem} />}
        </section>

        {filtered.length === 0 && !editMode && (
          <div
            className="neuro-card p-10 text-center mt-6"
            data-testid="empty-state"
          >
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
          Edit Mode On
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
  );
}

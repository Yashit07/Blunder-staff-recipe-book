# Blunder — Staff Recipe Manual & Menu Management

## Original Problem Statement
Build a clean, modern, aesthetic single-page React website with a "soft UI" (gentle shadows, subtle gradients, smooth transitions) for a business named "Blunder" — an interactive Staff Recipe Manual and Menu Management system.

Requirements:
1. **Brand & Theme** — "Blunder" wordmark, cream/off-white background, pastel/muted accents, neumorphic/glassmorphic card style, scannable for busy staff.
2. **Menu items** (smoothies AND salads + bowls + coffee, with categories) — each card shows item name, ingredients list with quantities, step-by-step preparation. **Size toggle Small/Medium/Large** that dynamically recalculates ingredient amounts. Default scaling: Small=0.66x, Medium=1.0x base, Large=1.5x.
3. **Protected Edit Mode** — "Edit" button top-right → password modal. Password is strictly `0007`. Correct unlocks Edit Mode (inline editable fields). Wrong shows subtle error. Save button locks edits and turns Edit Mode OFF. While OFF, all content is read-only.
4. **localStorage persistence** — edits survive page refresh.

## Architecture
- **Frontend only**: React 19 + React Router + Tailwind + sonner (toasts) + lucide-react (icons).
- **No backend changes** — pure client-side state with `localStorage` (key: `blunder.menu.v1`).
- Routes: single route `/` → `RecipeManual` page.
- Component tree:
  - `pages/RecipeManual.jsx` — state, persistence, filters, edit mode orchestration.
  - `components/blunder/Header.jsx` — brand + Edit/Save button.
  - `components/blunder/PasswordModal.jsx` — glassmorphic modal, password `0007`.
  - `components/blunder/MenuCard.jsx` — card with size toggle, scaled ingredients, steps, inline editing.
  - `components/blunder/SizeToggle.jsx` — Small/Medium/Large pill toggle.
  - `components/blunder/CategoryTabs.jsx` — All + dynamic categories.
  - `components/blunder/AddItemCard.jsx` — dashed "Add new recipe" card visible only in Edit Mode.
- Seed data: `data/seedData.js` — 7 recipes across Smoothies / Salads / Bowls / Coffee.

## User Personas
- **Floor / Bar Staff (primary, read-only)** — needs to quickly look up a recipe, switch size, follow scaled measurements without accidentally editing anything.
- **Shift Manager / Owner (edit, password-holder)** — uses `0007` to tweak ratios, add seasonal items, refine prep steps.

## Core Requirements (Static)
- Soft / neumorphic UI on cream `#F4F3EF` background; matcha green & peach accents.
- Manrope (display) + Work Sans (body) — anti-default fonts.
- All interactive elements have `data-testid`.
- Read-only by default; password gate is the only path to edits.
- Dynamic ingredient scaling per card, independent size selection.

## What's Been Implemented (2026-02)
- Initial MVP with 100% frontend test pass:
  - Brand header with sticky glassmorphic bar, lockable Edit button.
  - 7 seeded recipes across 4 categories (Smoothies, Salads, Bowls, Coffee).
  - Category filter tabs + live search across name/category/description/ingredients.
  - Size toggle (Small 0.66x / Medium 1x / Large 1.5x) with pulse-animated quantity changes.
  - Password modal (`0007`) with shake-on-wrong + subtle error message.
  - Inline Edit Mode for name, category, description, ingredient name/amount/unit, prep steps.
  - Add / Delete recipes; Add / Delete ingredients & steps within a card.
  - Save & Lock — persists to localStorage, restores read-only view.
  - Floating "Edit Mode On" pill while editing for unmistakable visual state.
  - localStorage persistence verified across reload (edits + new items + deletions stick).
  - Sonner toast notifications for unlock / save / delete.

## Prioritized Backlog
### P0 (none — MVP complete)

### P1
- Export / import recipes as JSON (for sharing across branches or backing up).
- Multi-user audit: track last edited timestamp + initials per recipe.
- Print-friendly view (one recipe per A4 page) for laminated quick-reference cards.

### P2
- Allergen / dietary tags (vegan, nut-free, gluten-free) with filter chips.
- Cost-per-serving calculator (ingredient price × scaled amount).
- Custom per-item size ratios (some items scale linearly, others non-linearly).
- Drag-to-reorder ingredients & steps in Edit Mode.
- Photo upload per recipe (object storage integration).

## Next Tasks
- Gather feedback on default scaling ratios from a real shift.
- Decide whether to keep purely-local persistence or add a backend sync for multi-device.

## Test Credentials
- Edit Mode password: **`0007`**

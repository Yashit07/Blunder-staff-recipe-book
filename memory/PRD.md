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

## What's Been Implemented (2026-02 — Iteration 3)
- **Default currency = ₹ (INR)** (still editable via header dropdown).
- **GitHub Pages deployment ready**:
  - `frontend/package.json` → `"homepage": "."` so build emits relative asset paths (works at any subpath).
  - `App.js` uses `HashRouter` so deep links survive on static hosts.
  - `/app/DEPLOY_GITHUB_PAGES.md` ships with two deploy paths (gh-pages branch + GitHub Actions).
- **Sale Price field** per recipe inside the Cost Estimate panel: editable in Edit Mode, displays Profit + Margin% (red if negative). Shown in print view too.
- **Line-cost preview** (`= ₹X.XX`) next to each ingredient's cost-per-unit input in Edit Mode — instant per-ingredient cost at current size.
- **Cost rounding control** in header (Exact / 0.1 / 0.5 / 1 / 5 / 10), applied to all monetary displays + print.
- **CSV export** alongside JSON: long-format CSV (one row per ingredient + per packaging item) with sale price & audit columns.

## What's Been Implemented (2026-02 — Iteration 2)
- **JSON Export / Import** (`blunder-recipes-YYYY-MM-DD.json`): one-click backup or branch-sync; import with confirmation replaces current set.
- **Print-friendly per-recipe view**: Printer icon on every card, opens browser print dialog with clean A4 layout (no chrome, dotted-line ingredient table, numbered steps, cost section, audit footer).
- **Per-recipe edit audit (who / when)**: On first unlock, prompts for editor initials (stored in localStorage `blunder.editor`). On Save, every recipe modified during the session is stamped with `lastEditedBy` + `lastEditedAt`. Subtle audit footer visible on each card.
- **Cost Estimator**: In Edit Mode, each ingredient gains a `Cost per unit` input. Live "Cost Estimate · {size}" panel shows Ingredients + Packaging + Total, all scaled with the selected size.
- **Packaging section** per recipe (cups, lids, sleeves, etc.): name + flat cost, addable/removable in Edit Mode, summed into the cost estimate.
- **Configurable currency symbol** (default `$`, editable in Edit Mode header, persisted in localStorage `blunder.currency`).
- Seed data updated: itm-1 has full sample cost & packaging data to demo the cost estimator out-of-the-box.

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

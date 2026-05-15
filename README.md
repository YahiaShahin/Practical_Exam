# C Programming — Interactive Study Guide

> Mansoura University · Intro to Programming · 2026  
> Built by **RevisKor**

A fully client-side, zero-dependency web app for studying and practising C programming. No build step, no server — open `index.html` in a browser and it works.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page — hero, CTA cards, topic chips, stats, credits, onboarding tour |
| `study.html` | Interactive study guide — 11 topics with demos, flowcharts, and live widgets |
| `problems.html` | Practice problems — 46+ questions with explanations, code breakdowns, and Try It panels |

---

## Project Structure

```
/
├── index.html           # Home / landing page
├── study.html           # Study guide
├── problems.html        # Practice problems
│
├── css/
│   ├── style.css        # Shared design system — tokens, themes, navbar, layout, typography
│   ├── study.css        # Study page styles — flowcharts, demos, loop viz, functions section
│   ├── problems.css     # Problems page styles — modal, cards, code panel
│   └── responsive.css   # Universal responsive layer — all breakpoints, overflow prevention
│
└── js/
    ├── nav.js           # Fixed navbar injected into all pages — hamburger, theme, ? tour button
    ├── study.js         # All study page interactivity
    ├── problems.js      # Problems page logic — modal, filter, search, progress, celebration
    └── problems-data.js # All question data (Q array)
```

---

## Features

### Home (`index.html`)
- **Onboarding tour** — 6-slide overlay shown on first visit, re-triggerable via the `?` button in the navbar
- **Topic chips** — animated hover chips for all 11 study topics
- **Course stats** — animated number counters (topics, problems, examples, standard)
- **Easter egg** — click **RevisKor** 5 times in the footer (hint text says "do not click this"). A hacker-style terminal types out a motivational message. Also triggerable via the Konami code (↑↑↓↓←→←→BA)

### Study Guide (`study.html`)
- **11 topics**: Syntax Basics → Scopes → Variables → Operators → Printf/Scanf → Conditions → Loops → **Functions** → 1D Arrays → 2D Arrays → Quick Reference
- **Detailed / Brief toggle** — full explanations vs. TL;DR summaries
- **Interactive Order of Operations table** (S4) — click any precedence row to see a step-by-step evaluation with live code
- **Functions section** (S8) — 4 clickable type cards (void/no-params, void/params, return/no-params, return/params), each opening a detail panel with explanation, anatomy breakdown, syntax-highlighted code, and tip
- **Interactive loop flowchart** — step through `for`, `while`, `do...while` phase by phase with live code highlighting
- **Live printf builder** — edit values, watch C code and terminal output update in real time
- **Operator calculator** — C-accurate integer division and modulo
- **Scope visualiser** — click any scope to see accessible variables
- **Array inspector** — click cells to inspect address, index, value; resize and edit live
- **2D matrix inspector** — hover rows/columns, click cells, resize
- **Sidebar progress tracker** — marks sections viewed via IntersectionObserver; sticky sidebar scrolls with the page
- **7 themes** — Paper, Latte, Nord, Original Dark, Midnight Gold, Neon Synth, Rosé Pine

### Problems (`problems.html`)
- **46+ questions** grouped by topic
- **Modal study view** per question:
  - Full explanation + step-by-step walkthrough
  - Line-by-line code breakdown
  - Common mistakes + syntax tip
  - Expected output
  - Syntax-highlighted C code panel with copy button
  - **Try It** — interactive inputs that simulate program output
  - Personal notes (auto-saved to localStorage per question)
- **Detailed / Brief mode toggle** in toolbar
- **Progress tracking** — mark as learned, progress bar, localStorage persistence
- **Search** — across titles, briefs, and concepts
- **Topic filter** buttons
- **Keyboard navigation** — `←`/`→` navigate, `Esc` close, `/` focus search
- **100% completion celebration**:
  - **First time ever** → full confetti + trophy card with motivational quote
  - **After a reset, finishing again** → quieter "you did it again" variant with rising particles and a different message
  - Fires once per browser session (sessionStorage); resets when progress is reset

### Navbar (all pages)
- **Fixed position** — always visible, no gap issues
- **Hamburger menu** on mobile (≤ 640px) — collapses links and theme selector into a dropdown
- **`?` button** — always visible; reopens the onboarding tour on the home page, or navigates to `index.html?tour=1` from other pages
- **Theme selector** — 7 themes, saved to localStorage

---

## Themes

Themes are set via `data-theme` on `<html>` and saved to `localStorage` under `study_theme`.

| Key | Description |
|---|---|
| `paper` | Clean white (default) |
| `latte` | Catppuccin Latte (light) |
| `nord` | Icy blue-grey |
| `dark-original` | Deep navy with cyan accent |
| `midnight-gold` | Black with gold accent |
| `neon-synth` | Deep purple with neon cyan |
| `rose-pine` | Muted rose and purple |

---

## Data

All question data lives in `js/problems-data.js` as `const Q = [...]`. Each entry:

```js
{
  num,                    // int — question number
  title,                  // string
  tag,                    // string — topic slug
  tagLabel,               // string — display label
  group,                  // string — "practical" | tag slug
  brief,                  // string — one-line summary (Brief mode)
  concepts,               // string[]
  explanationDetailed,    // HTML string
  whatHappens,            // string[] | undefined
  breakdown,              // { code, text }[]
  mistakes,               // { text }[] | undefined
  syntaxTip,              // HTML string
  output,                 // string — expected terminal output
  rawCode,                // string — full C source
  tryIt,                  // { desc, inputs[], run(vals) } | undefined
  layout,                 // "wide" | undefined
}
```

---

## localStorage / sessionStorage Keys

| Storage | Key | Value |
|---|---|---|
| `localStorage` | `study_theme` | Active theme name |
| `localStorage` | `csg3_learned` | JSON array of learned question numbers |
| `localStorage` | `csg3_notes` | JSON object — question number → note string |
| `localStorage` | `csg3_modal_mode` | `"detailed"` or `"brief"` |
| `localStorage` | `c_tour_seen` | `"true"` when onboarding has been seen |
| `localStorage` | `csg3_celebrated_once` | `"1"` after first 100% completion |
| `sessionStorage` | `csg3_cel_session` | `"1"` — blocks celebration re-firing in same tab session |

---

## Browser Support

Any modern browser (Chrome, Firefox, Edge, Safari). No polyfills. Uses:
- CSS custom properties, `position: fixed`, `clamp()`
- IntersectionObserver
- `sessionStorage` / `localStorage`
- `navigator.clipboard` (copy button — gracefully absent if unavailable)

---

## Running Locally

Open `index.html` directly in a browser. No server, no npm, no build step.

```bash
# Windows
start index.html

# macOS / Linux
open index.html
```

Or use VS Code's Live Server extension for auto-reload during development.

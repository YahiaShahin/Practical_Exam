# C Programming — Interactive Study Guide

> Mansoura University · Intro to Programming · 2026  
> Built by **RevisKor**

A fully client-side, zero-dependency web app for studying and practising C programming. No build step, no server — open `index.html` in a browser and it works.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page — links to both tools, guided tour, credits |
| `study.html` | Interactive study guide — 10 topics with demos, flowcharts, and live widgets |
| `problems.html` | Practice problems — 50+ questions with explanations, code breakdowns, and Try It panels |

---

## Project Structure

```
/
├── index.html          # Home / landing page
├── study.html          # Study guide
├── problems.html       # Practice problems
│
├── css/
│   ├── style.css       # Shared design system — tokens, themes, layout, typography
│   ├── study.css       # Study page specific styles — flowcharts, demos, loop viz
│   └── problems.css    # Problems page specific styles — modal, cards, code panel
│
└── js/
    ├── nav.js          # Navbar injected into all pages
    ├── study.js        # All study page interactivity
    ├── problems.js     # Problems page logic — modal, filter, search, mode toggle
    └── problems-data.js # All question data (Q array) — ~2700 lines
```

---

## Features

### Study Guide (`study.html`)
- **10 topics** covering the full Mansoura Uni intro syllabus: Syntax → Scopes → Variables → Operators → Printf/Scanf → Conditions → Loops → 1D Arrays → 2D Arrays → Quick Reference
- **Detailed / Brief toggle** — switch between full mentor-style explanations and TL;DR summaries
- **Interactive loop flowchart** — step through `for`, `while`, and `do...while` execution phase by phase, with live code highlighting and adjustable From/To parameters that auto-update the code display
- **Live printf builder** — edit name/score/GPA and watch the C code and terminal output update in real time
- **Operator calculator** — live C-accurate integer division and modulo
- **Scope visualiser** — click any scope to see exactly which variables are accessible
- **Array inspector** — click cells to inspect address, index, and value; resize and edit live
- **2D matrix inspector** — hover rows/columns, click cells, resize
- **Sidebar progress tracker** — marks sections as viewed via IntersectionObserver
- **6 themes** — Nord (default), Original, Midnight Gold, Neon Synth, Rosé Pine, Latte, Paper

### Problems (`problems.html`)
- **50+ questions** grouped into: Practical Exam (Q1–Q20), Task 1, Task 2, Task 3
- **Modal study view** — each question opens a full panel with:
  - Long-form explanation
  - Step-by-step execution walkthrough
  - Line-by-line code breakdown
  - Common mistakes
  - Syntax tip
  - Expected output
  - Live C code panel (syntax highlighted, copy button)
  - **Try It** — interactive inputs that simulate the program output
  - Personal notes (auto-saved per question to localStorage)
- **Detailed / Brief mode toggle** — universal toggle in the toolbar; Brief mode shows only the one-liner summary, breakdown, tip, concepts, and output — ideal for quick revision
- **Progress tracking** — mark questions as learned, progress bar, per-session persistence via localStorage
- **Search** — fuzzy search across titles, briefs, and concepts
- **Topic filter** — filter by tag group
- **Keyboard navigation** — `←` / `→` to navigate questions, `Esc` to close, `/` to focus search
- **Swipe navigation** — touch swipe left/right to navigate on mobile

---

## Themes

Themes are set via `data-theme` on `<html>` and saved to `localStorage` under the key `study_theme`.

| Theme key | Description |
|---|---|
| `paper` | Clean white (default) |
| `latte` | Catppuccin Latte (light) |
| `nord` | Icy blue-grey |
| `dark-original` | Original dark — deep navy with cyan accent |
| `midnight-gold` | Black with gold accent |
| `neon-synth` | Deep purple with neon cyan |
| `rose-pine` | Muted rose and purple |

Light themes (`latte`, `paper`) have dedicated overrides in `style.css` and `problems.css` to ensure syntax tokens and UI elements remain readable.

---

## Data

All question data lives in `js/problems-data.js` as a single `const Q = [...]` array. Each entry has:

```js
{
  num,              // int — question number
  title,            // string
  tag,              // string — topic slug
  tagLabel,         // string — display label
  group,            // string — "practical" | tag slug
  brief,            // string — one-line summary (shown in Brief mode)
  concepts,         // string[] — concept tags
  explanationDetailed, // HTML string — full explanation
  whatHappens,      // string[] | undefined — step-by-step list
  breakdown,        // { code, text }[] — line-by-line breakdown
  mistakes,         // { text }[] | undefined — common mistakes
  syntaxTip,        // HTML string
  output,           // string — expected terminal output
  rawCode,          // string — full C source (with \n newlines)
  tryIt,            // { desc, inputs[], run(vals) } | undefined
  layout,           // "wide" | undefined — optional wide modal
}
```

To add a new question, append an object to the `Q` array following the same shape.

---

## localStorage Keys

| Key | Value |
|---|---|
| `study_theme` | Active theme name |
| `csg3_learned` | JSON array of learned question numbers |
| `csg3_notes` | JSON object mapping question number → note string |
| `csg3_modal_mode` | `"detailed"` or `"brief"` |

---

## Browser Support

Works in any modern browser (Chrome, Firefox, Edge, Safari). No polyfills needed. Uses:
- CSS custom properties (variables)
- IntersectionObserver
- `navigator.clipboard` (copy button — gracefully absent if unavailable)
- `localStorage`

---

## Running Locally

Just open `index.html` directly in a browser. No server, no npm, no build step.

```
# Windows
start index.html

# macOS
open index.html
```

Or use VS Code's Live Server extension for auto-reload during development.

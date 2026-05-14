# C Programming — Practical Exam Study Guide

An interactive, single-file web app for studying C programming exam questions. Built by **RevisKor**.

---

## Overview

A self-contained HTML study tool covering 20 practical C programming questions across 5 topic areas. Each question includes deep beginner-friendly explanations, annotated code breakdowns, common mistakes, and a live "Try It" sandbox — all with progress tracking saved to your browser.

---

## Features

- **20 questions** across 5 topic categories: Basics, Conditionals, Switch, Loops, and Arrays/Input
- **Interactive "Try It" panel** — tweak inputs and see simulated C output update in real time, no compiler needed
- **Deep explanations** — each question has a full written explanation, a step-by-step "what happens" breakdown, annotated line-by-line code analysis, common mistakes, and a syntax tip
- **Progress tracking** — mark questions as "Learned"; progress bar and counter persist via `localStorage`
- **Per-question notes** — a private notepad saved automatically per question
- **Search** — filter questions by title or concept keywords
- **Tag filters** — quickly narrow to a single topic category
- **Copy code** — one-click copy of each question's C source code
- **Keyboard navigation** — arrow keys to move between questions in the modal, `/` to focus search, `Esc` to close
- **Swipe navigation** — swipe left/right in the detail modal on touch devices
- **No dependencies** — single `.html` file, works entirely offline (only Google Fonts are loaded externally)

---

## Questions Covered

| # | Title | Topic |
|---|-------|-------|
| 1 | Basic Calculator (all operations) | Basics |
| 2 | Odd or Even Checker | Conditionals |
| 3–5 | *(additional Basics/Conditionals questions)* | Basics / Conditionals |
| 6–9 | *(Switch statement questions)* | Switch |
| 10–14 | *(Loop questions)* | Loops |
| 15–20 | *(Array and input questions)* | Arrays/Input |

---

## Usage

1. Download `index.html`
2. Open it in any modern browser (Chrome, Firefox, Safari, Edge)
3. No server, build step, or internet connection required (fonts may not load offline, but everything else works)

### Navigation

- **Cards view** — browse all questions; click **Details** to open the full explanation modal
- **Modal** — left panel shows explanation, right panel shows code and the Try It sandbox
- **Filter bar** — click a topic tag to show only that category
- **Search bar** — type to filter by question title or concept (press `/` to jump to search)
- **Mark as Learned** — click the button in the modal footer or the card to track your progress
- **Reset** — the reset button in the progress bar clears all learned states

---

## Tech Stack

| Layer | Details |
|-------|---------|
| Structure | Vanilla HTML5 |
| Styling | Vanilla CSS with custom properties (no framework) |
| Logic | Vanilla JavaScript (no libraries) |
| Fonts | JetBrains Mono, Syne (Google Fonts) |
| Storage | `localStorage` for progress, notes, and learned state |
| Compatibility | All modern browsers; mobile-responsive |

---

## File Structure

Everything lives in a single file:

```
index.html
├── <style>        — all CSS (dark theme, responsive layout, animations)
├── <body>         — header, toolbar, progress bar, card grid, modal, toast
└── <script>
    ├── Q[]        — data array: 20 question objects with explanations,
    │                breakdowns, mistakes, syntax tips, raw code, tryIt config
    ├── renderCards()   — builds and filters the card grid
    ├── openModal()     — populates and opens the detail modal
    ├── runTryIt()      — executes the interactive simulation
    ├── save() / load() — localStorage persistence
    └── event listeners — search, keyboard shortcuts, swipe, scroll
```

---

## Customisation

To add a question, append an object to the `Q` array in the `<script>` block:

```js
{
  num: 21,
  title: "Your Question Title",
  tag: "basics",          // basics | conditionals | switch | loops | arrays
  tagLabel: "Basics",
  brief: "One-sentence description shown on the card.",
  concepts: ["keyword1", "keyword2"],

  explanation: `<p>HTML explanation text here...</p>`,
  whatHappens: ["Step 1...", "Step 2..."],
  breakdown: [
    { code: "int x = 0;", text: "Explanation of this line." }
  ],
  mistakes: [
    { text: "Common mistake description with <code>code</code> inline." }
  ],
  syntaxTip: "A tip about syntax...",
  output: "Expected terminal output string",
  rawCode: `#include <stdio.h>\n\nint main() {\n    // your code\n    return 0;\n}`,

  tryIt: {
    desc: "Description shown above the inputs.",
    inputs: [
      { id: "ti_x", label: "Input label", type: "number", default: 5 }
    ],
    run(vals) {
      const x = parseInt(vals.ti_x) || 0;
      return `Result: ${x}`;
    }
  }
}
```

---

## License

No license specified. Created by **RevisKor** for personal exam preparation use.

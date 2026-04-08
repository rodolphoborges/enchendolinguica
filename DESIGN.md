# Design System: Gossip Audit

## 1. Visual Theme & Atmosphere

**Gossip Audit** is a premium analytical platform that monitors celebrity news with a blend of cinematic high-tech and minimalist precision. The aesthetic, "Sophisticated Casing," combines deep obsidian backgrounds with translucent glass layers and vibrant Rose-Neon accents. 

The atmosphere should feel like a "Control Room for the Frivolous." It borrows from the cyberpunk genre but replaces the grit with administrative elegance. We use **Outfit** as our core typeface for its modern, geometric clarity and high-end editorial feel.

**Key Characteristics:**
- **Obsidian Foundation**: Deep, almost-black backgrounds (`#020202`) that provide infinite depth.
- **Advanced Glassmorphism**: Multi-layered translucent surfaces with variable blur and subtle additive borders.
- **Cyber-Rose Accents**: A single primary accent color (`#f43f5e`) used sparingly for critical feedback, animations, and branding.
- **Precision Typography**: Wide tracking for headers, tight leading for body, and monospaced accents for data.
- **Dynamic Depth**: Elements "float" using a combination of backdrop filters and multi-layer shadows (tinted with the accent color).

---

## 2. Color Palette & Roles

### Core
- **Obsidian** (`#020202`): Primary page background and base layer.
- **Zinc Dark** (`#0a0a0b`): Base color for glass panels and card surfaces.
- **Rose Glow** (`#f43f5e`): The signature accent color. Used for "Active" states, CTAs, and pulses.
- **Rose Muted** (`#e11d48`): Secondary accent for hover states and borders.

### Surface & Border
- **Glass Panel**: `rgba(10, 10, 11, 0.7)` with `12px` blur.
- **Glass Card**: `rgba(18, 18, 20, 0.4)` with `8px` blur.
- **Subtle Border**: `rgba(255, 255, 255, 0.05)` (Default)
- **Active Border**: `rgba(244, 63, 94, 0.2)` (Rose themed)

### Typography
- **White** (`#fafafa`): Headings and primary emphasis.
- **Zinc-400** (`#a1a1aa`): Secondary labels and metadata.
- **Zinc-600** (`#52525b`): Tertiary text and subtle auxiliary information.

---

## 3. Typography Rules

### Font Family
- **Primary**: `Outfit`, Sans-serif.
- **Data/Mono**: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `Liberation Mono`, `Courier New`, monospace.

### Hierarchy

| Role | Size | Weight | Letter Spacing | Case | Role |
|------|------|--------|----------------|------|------|
| Brand Display | 4rem+ | 900 (Black) | -0.05em | Normal | Hero Logo |
| Section Header | 0.625rem | 900 (Black) | 0.4em | Uppercase | Categorization/Labels |
| Card Title | 1.125rem | 700 (Bold) | Normal | Normal | News Headlines |
| Info Meta | 0.5625rem | 900 (Black) | 0.2em | Uppercase | Metadata, Sync info |
| Body Text | 0.875rem | 500 (Medium) | Normal | Normal | Card descriptions |

---

## 4. Component Stylings

### Buttons
- **Primary Rose**: Background `#f43f5e`, Text `#ffffff`, Weight 900. Shadow: `rgba(244, 63, 94, 0.2)` pulse.
- **Ghost Action**: Transparent background, border `1px solid rgba(244, 63, 94, 0.3)`, color `#f43f5e`.
- **Panel Close**: Circular, hover `bg-white/5`.

### Cards & Panels
- **Main Panel**: Rounded `24px` to `32px`. Backdrop filter `blur(12px)`.
- **Feed Item**: Border `1px solid rgba(255, 255, 255, 0.03)`. Radius `16px`. Hover state applies a subtle `rgba(244, 63, 94, 0.03)` background shift.

### Input Fields
- Background: `rgba(0, 0, 0, 0.5)`. Border: `1px solid rgba(255, 255, 255, 0.05)`. Focus: `border-rose-500/50`.

---

## 5. Layout Principles

### Spacing System
- Base unit: `4px`.
- Common spacings: `12px`, `24px`, `32px`, `48px`.
- Hero padding: `48px` to `96px` vertical.

### Elevation
- **Level 1 (Ambient)**: Subtle cards, no shadow.
- **Level 2 (Active)**: Modals and floating buttons. Shadows tinted with `#f43f5e` at `0.1 opacity`.
- **Level 3 (Modal Overlay)**: `bg-black/80` with `backdrop-blur-md`.

---

## 6. Micro-animations

- **Robô Ativo**: Smooth `pulse` animation on a 1.5px dot.
- **Interactive Shift**: All buttons and cards transition over `300ms` using `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Gears**: 360deg rotation on hover/active states for settings.

---

## 7. Do's and Don'ts

### Do
- Use **Outfit** with heavy weights (700-900) for labels.
- Use **extremely wide letter-spacing** for section headers.
- Keep glass panels translucent but legible.
- Use Rose (`#f43f5e`) as the ONLY interactive color.

### Don't
- Don't use standard blue, green, or yellow.
- Don't use border-radius smaller than `12px` (except for very small elements).
- Don't use solid black for any glass panel; always use translucency.
- Don't use light themes; the project is strictly "Obsidian/Rose."

---

## 8. Agent Prompt Guide

"Design a news card following the Gossip Audit system: use `rgba(18, 18, 20, 0.4)` as background with a `8px` blur. Border should be `1px solid rgba(255, 255, 255, 0.03)`. Header inside needs to use `text-rose-500` with `uppercase` and `tracking-[0.5em]` at `9px`. The main title should be `text-lg` and `font-bold`."

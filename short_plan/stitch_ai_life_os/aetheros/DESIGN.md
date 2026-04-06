# Design System Document: The Ethereal Intelligence

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Ghost in the Machine"**

This design system moves away from the "Dashboard" archetype and toward a "Living Environment." In an AI Life Operating System, the interface should feel less like a tool and more like a sophisticated, ambient companion. We achieve this through **Atmospheric Depth**—using layers of translucency, light refraction, and intentional asymmetry to break the rigid, boxed-in feeling of traditional software.

The goal is to create a "High-End Editorial" experience for data. By leveraging high-contrast typography scales (the juxtaposition of the technical *Inter* with the architectural *Manrope*) and prioritizing "breathing room" over density, we ensure the user feels in control of their digital life, rather than overwhelmed by it.

---

### 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in the deep void of space (`surface: #121318`) punctuated by the "electric pulse" of AI (`primary_container: #00f0ff`).

*   **The "No-Line" Rule:** Direct structural borders are strictly prohibited for layout sectioning. Separation must be achieved through **Value Shifting**. For example, a sidebar using `surface_container_low` should sit against a main content area of `surface`. The edge is defined by the shift in tone, not a 1px stroke.
*   **Surface Hierarchy & Nesting:** Use the `surface_container` tiers to create a physical sense of "closeness" to the user.
    *   **Background:** `surface` (#121318)
    *   **Recessed Elements:** `surface_container_lowest` (#0d0e13)
    *   **Standard Cards:** `surface_container_low` (#1a1b21)
    *   **Active/Elevated Modals:** `surface_container_highest` (#34343a)
*   **The Glass & Gradient Rule:** Floating elements (like chat bubbles or hover-state cards) should utilize Glassmorphism. Apply a backdrop-blur (12px–20px) to `surface_variant` at 40% opacity. 
*   **Signature Textures:** Main CTAs should not be flat. Use a linear gradient from `primary` (#dbfcff) to `primary_fixed_dim` (#00dbe9) at a 135° angle to simulate a glowing light source.

---

### 3. Typography: Editorial Authority
We use a dual-typeface system to distinguish between **Data (Inter)** and **Direction (Manrope)**.

*   **Display & Headlines (Manrope):** These are your "Statement" tiers. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. The architectural nature of Manrope provides the "High-Tech" sophistication required for a premium OS.
*   **Body & Labels (Inter):** Inter is the workhorse. Its neutral, high-legibility character is used for all conversational AI output and data-rich cards. 
*   **The Hierarchy Strategy:** Always pair a `headline-sm` in Manrope with a `body-md` in Inter to create a clear "Title vs. Content" relationship that feels like a premium magazine layout.

---

### 4. Elevation & Depth: Tonal Layering
In this system, "Up" is "Light." We do not use traditional drop shadows; we use **Luminance**.

*   **The Layering Principle:** To lift a card, do not add a shadow. Instead, move it from `surface_container_low` to `surface_container_high`. 
*   **Ambient Shadows:** If a floating action button (FAB) or global search bar requires a shadow, it must be a "Glow." Use the `primary` color at 8% opacity with a 32px blur—this mimics the light of a screen reflecting off a surface.
*   **The "Ghost Border" Fallback:** If a boundary is visually required for accessibility, use a 1px stroke of `outline_variant` at 15% opacity. This "Ghost Border" provides a hint of structure without interrupting the visual flow.
*   **Glassmorphism Implementation:**
    *   `Background: surface_variant` (at 30-50% opacity)
    *   `Backdrop-filter: blur(16px)`
    *   `Border: 1px solid rgba(255, 255, 255, 0.05)` (Simulating a glass edge)

---

### 5. Components: Fluid Primitives

*   **Buttons:**
    *   **Primary:** Gradient (`primary` to `primary_fixed_dim`), `xl` roundedness (1.5rem). No border. White text (`on_primary_fixed`).
    *   **Secondary:** Ghost Border style. `surface_container_high` background with 10% `outline_variant` stroke.
*   **Conversational Chat Bubbles:**
    *   **AI Response:** Glassmorphic (`surface_variant` @ 40% + blur). Asymmetrical corners: `xl` for top-left, top-right, and bottom-right; `sm` for bottom-left.
    *   **User Input:** Solid `secondary_container`. Aligned right.
*   **Data-Rich Cards:** Use `surface_container_low`. Forbid divider lines. Separate data points using 24px of vertical whitespace or a 4px `primary` accent bar on the far left of the card.
*   **Sleek Sidebars:** Use `surface_container_lowest`. Icons should be `outline` color, shifting to `primary` on active state. Use `full` roundedness for the active-state indicator pill.
*   **Animated Progress Indicators:** Never use a standard "loading spinner." Use a 2px height linear bar using a "pulse" animation transitioning from `secondary` to `primary`.

---

### 6. Do’s and Don’ts

#### **Do:**
*   **Do** use asymmetrical layouts. Place a large `display-lg` headline on the left and a small `body-sm` description on the far right to create tension and interest.
*   **Do** use `primary_container` (#00f0ff) sparingly as a "data highlight" or "AI active" indicator.
*   **Do** prioritize whitespace. If a screen feels crowded, increase the padding rather than adding a divider.

#### **Don’t:**
*   **Don’t** use pure black (#000000). Always use the `surface` palette to maintain the "Deep Indigo" sophisticated tone.
*   **Don’t** use 100% opaque borders. They "kill" the glass effect and make the UI look like a standard template.
*   **Don’t** use "Standard" easing for animations. Use custom cubic-beziers (e.g., `cubic-bezier(0.22, 1, 0.36, 1)`) to make transitions feel fluid and "high-end."
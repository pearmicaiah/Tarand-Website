# Innscor Clone - Architecture Audit & Discrepancy Report

## Executive Summary
The local codebase is a static HTML/Tailwind project aiming to clone `innscorafrica.com`. The live site uses WordPress/Elementor. There are visual and structural discrepancies that need addressing to achieve 100% parity.

## 1. Structural Discrepancies (HTML/DOM)

| Feature | Live Site (Reference) | Local Codebase | Action Required |
| :--- | :--- | :--- | :--- |
| **Header** | Elementor Sticky Header with multiple tiers. | Custom HTML structure. Missing some internal wrappers. | Align classes and ensure sticky behavior matches. |
| **Navigation** | Mega Menu for "Our Brands" uses a DearFlip 3D flipbook (currently). | Hardcoded static HTML mega-menu with "tab-like" buttons. | **Refactor**: Implement functional vertical tab logic to replace static buttons. |
| **Hero Section** | Swiper.js Slider (or Video BG). Full screen. | Iframe Video Background (`vimeo`). | Keep Video Iframe if it closely matches visual, but ensure overlay content matches. |
| **"Leaf" Cards** | Used in Mission/Vision. `border-radius: 40px` (TL/BR). | `.leaf-card` has `80px` radius. | **Fix**: Update CSS to `40px` to match live site exactly. |
| **Footer** | 4-column layout. | 4-column layout (matches well). | Verify padding and font sizes. |

## 2. Style Discrepancies (CSS)

| Property | Live Site | Local Codebase | Action |
| :--- | :--- | :--- | :--- |
| **Font Family** | `Montserrat` (Headings), System Fonts (Body). | `Montserrat` (Headings & Body). | Reset Body font to system stack for exact parity. |
| **Line Height** | `1.5` (24px). | `1.6`. | **Fix**: precise matching to `1.5`. |
| **Colors** | Primary: `#06205D` (approx), Yellow: `#F9B41B`. | Defined in Tailwind config. | Verify exact Hex codes. |
| **Leaf Radius** | `40px` top-left, `40px` bottom-right. | `80px`. | **Fix**: Change to `40px`. |

## 3. Assets & Paths

| Asset Type | Current State | Required Action |
| :--- | :--- | :--- |
| **Images** | Hotlinking to `https://www.innscorafrica.com/wp-content/...` | **Download**: Fetch all hotlinked images to local `assets/` folder. |
| **Icons** | FontAwesome CDN (matches). | N/A |

## 4. Component Logic

- **Vertical Tabs ("Our Brands")**: Currently static HTML. Needs a JS controller to handle `active` states and content switching.
- **Hero Animation**: Live site has reveal animations. Local has `.reveal` class but needs tuning to match ease/timing.

## Implementation Plan

1.  **Assets**: Run script to download all external images found in `index.html`.
2.  **Styles**: 
    -   Update `src/style.css` to fix `.leaf-card` radius.
    -   Update `body` line-height and font-stack.
3.  **Logic**: 
    -   Write `src/tabs.js` to handle the Mega Menu interaction.
    -   Bind it to the DOM.
4.  **Verification**: 
    -   Screenshot comparison.

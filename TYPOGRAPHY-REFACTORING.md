# Typography Refactoring Guide

## Overview

We've set up a typography system with global styles in `src/app/typography.css` and implemented the Rubik variable font in `src/app/layout.tsx`. This system allows us to use native HTML elements without additional classes for consistent typography.

## What to Remove

When refactoring components, remove the following className properties from typography elements:

### Headings

- Remove from h1: `text-4xl`, `text-3xl`, `font-bold`, `font-semibold`, `tracking-tight`, `leading-normal` etc.
- Remove from h2: `text-3xl`, `text-2xl`, `font-semibold`, etc.
- Remove from h3: `text-2xl`, `font-semibold`, etc.
- Remove from h4: `text-xl`, `font-medium`, etc.
- Keep non-typography related classes such as: `hidden`, `md:block`, placement classes like `text-right`

### Paragraphs

- Remove from p: `text-lg`, `leading-normal`, `font-medium`, `text-sm` etc.
- Replace `text-muted-foreground` with the utility class `muted`
- Replace `text-gray-600` with the utility class `muted`

## Special Typography Classes

Use these utility classes for special typography needs:

- `.lead` - For larger introductory paragraphs
- `.large` - For slightly larger text
- `.small` - For smaller text 
- `.muted` - For subdued/secondary text

## Examples

### Before:
```jsx
<h1 className="font-heading text-4xl w-72 md:w-auto leading-normal md:text-7xl">
  Heading Text
</h1>
<p className="max-w-[55rem] leading-normal text-muted-foreground sm:text-lg md:px-4 px-2 sm:leading-8">
  Paragraph text
</p>
```

### After:
```jsx
<h1 className="font-heading w-72 md:w-auto">
  Heading Text
</h1>
<p className="max-w-[55rem] md:px-4 px-2">
  Paragraph text
</p>
```

## Special Case Handling

1. **Responsive Typography**: 
   - If you need different sizes at different breakpoints, consider adding media queries to typography.css.

2. **RTL Handling**:
   - Keep directional classes like `text-right` or `rtl`

3. **Placement Classes**:
   - Keep classes that affect positioning but not typography styling

4. **Font Family Overrides**:
   - Keep `font-heading` or other font family classes if needed

This refactoring will result in cleaner, more maintainable code that leverages our global typography system. 
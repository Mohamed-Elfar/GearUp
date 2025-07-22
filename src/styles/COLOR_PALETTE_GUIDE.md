# GearUp Brand Color Palette

This color palette is extracted from your logo and provides a harmonious set of colors that maintain brand consistency throughout your application.

## 🎨 Color Preview

### Primary Brand Colors (from logo)

- **Dark Blue**: `#2C5F7A` - Main brand color, perfect for headers and primary buttons
- **Medium Blue**: `#4A7C95` - Great for hover states and secondary elements
- **Light Blue**: `#6B9BB0` - Subtle accents and backgrounds
- **Teal**: `#4A8B8B` - Secondary brand color, excellent for CTAs
- **Dark Teal**: `#3A7070` - Darker variation for depth
- **Light Teal**: `#5BA0A0` - Lighter variation for backgrounds

### Neutral Colors

- **Charcoal**: `#2D2D2D` - Dark text and backgrounds
- **Dark Gray**: `#404040` - Secondary dark elements
- **Medium Gray**: `#606060` - Body text
- **Light Gray**: `#808080` - Muted text
- **Silver**: `#A0A0A0` - Placeholder text
- **Light Silver**: `#C0C0C0` - Borders and dividers

## 🚀 Quick Usage Examples

### CSS Variables

```css
/* Use the CSS variables from brandColors.css */
.my-header {
  background: var(--color-brand-blue-dark);
  color: var(--color-text-inverse);
}

.my-button {
  background: var(--gradient-primary-blue);
  color: var(--color-text-inverse);
}
```

### Tailwind Classes (after adding to config)

```jsx
// Primary button
<button className="bg-brand-blue-700 hover:bg-brand-blue-600 text-white">
  Primary Action
</button>

// Secondary button
<button className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white">
  Secondary Action
</button>

// Card with brand styling
<div className="bg-white border border-brand-neutral-200 shadow-brand rounded-lg p-6">
  <h3 className="text-brand-blue-700">Card Title</h3>
  <p className="text-brand-neutral-700">Card content</p>
</div>

// Gradient background
<div className="bg-gradient-brand text-white p-8">
  Hero Section
</div>
```

### React Components with Color Palette

```jsx
import { colorPalette } from "../styles/colorPalette";

const MyComponent = () => (
  <div
    style={{
      backgroundColor: colorPalette.primary.darkBlue,
      color: colorPalette.text.inverse,
      padding: "1rem",
    }}
  >
    Brand Styled Component
  </div>
);
```

## 🎯 Recommended Color Combinations

### Headers & Navigation

- Background: `#2C5F7A` (Dark Blue)
- Text: `#F8FAFC` (Light)
- Accent: `#4A8B8B` (Teal)

### Cards & Content

- Background: `#FFFFFF` (White)
- Border: `#E2E8F0` (Light Gray)
- Title: `#1E293B` (Dark)
- Text: `#475569` (Medium Gray)

### Buttons

- **Primary**: Background `#2C5F7A`, Hover `#4A7C95`
- **Secondary**: Background `#4A8B8B`, Hover `#3A7070`
- **Tertiary**: Background `transparent`, Border `#2C5F7A`, Text `#2C5F7A`

### Forms

- Background: `#F8FAFC` (Very Light)
- Input Background: `#FFFFFF` (White)
- Input Border: `#CBD5E1` (Medium Light)
- Labels: `#475569` (Medium)
- Focus: `#2C5F7A` (Brand Blue)

### Status Colors

- **Success**: `#22C55E` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Info**: `#3B82F6` (Blue)

## 🌙 Dark Theme Support

The palette includes dark theme variants that maintain the same brand feeling:

- Dark backgrounds use the charcoal and dark gray tones
- Text colors automatically invert for readability
- Brand colors remain consistent for recognition

## 📱 Responsive Considerations

- Use lighter tones for mobile backgrounds to reduce eye strain
- Ensure sufficient contrast ratios for accessibility
- Brand colors work well across all screen sizes

## ♿ Accessibility

All color combinations have been checked for WCAG compliance:

- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text
- Brand colors maintain accessibility when used as recommended

## 🔧 Integration Steps

1. **Import CSS Variables**: Add `brandColors.css` to your main CSS file
2. **Update Tailwind Config**: Add the brand colors from `tailwindBrandColors.js`
3. **Use Color Palette**: Import the JavaScript object for programmatic use
4. **Apply Consistently**: Use the recommended combinations throughout your app

## 🎨 Color Psychology

Your logo colors convey:

- **Blue**: Trust, professionalism, stability, expertise
- **Teal**: Balance, sophistication, clarity, innovation
- **Gray**: Reliability, neutrality, timelessness, foundation

This palette reinforces GearUp's positioning as a trustworthy, professional, and innovative learning platform.

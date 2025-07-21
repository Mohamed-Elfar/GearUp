# GearUp Brand Color Palette

This color palette provides a modern, professional set of colors that maintain brand consistency throughout your application.

## 🎨 Color Preview

### Primary Brand Colors

- **Primary Blue**: `#007BFF` - Main brand color, perfect for headers and primary buttons
- **Accent Blue**: `#00AEEF` - Bright accent color for CTAs and highlights
- **Metallic Silver**: `#C0C0C0` - Elegant metallic accents and borders

### Background Colors

- **Dark Navy**: `#0A0F1C` - Deep dark background for dark theme
- **Soft Gray**: `#E0E0E0` - Light neutral background
- **Jet Black**: `#101010` - Pure dark background for contrast

### Text Colors

- **Main Text**: `#FFFFFF` - Primary text color (white)
- **Secondary Text**: `#C0C0C0` - Secondary text using metallic silver
- **Link Color**: `#00AEEF` - Links use accent blue
- **Link Hover**: `#007BFF` - Link hover state uses primary blue

### Utility Colors

- **Border**: `#C0C0C0` - Default border color
- **Card Background**: `#E0E0E0` - Card and content backgrounds

## 🚀 Quick Usage Examples

### CSS Variables

```css
/* Use the CSS variables from index.css */
.my-header {
  background: var(--color-dark-navy);
  color: var(--color-text-main);
}

.my-button {
  background: var(--color-primary-blue);
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
}

.my-button:hover {
  background: var(--color-accent-blue);
}
```

### Bootstrap Classes Integration

```jsx
// Primary button with your palette
<button className="btn btn-primary">
  Primary Action
</button>

// Card with brand styling
<div className="card shadow-sm">
  <div className="card-body">
    <h5 className="card-title text-primary">Card Title</h5>
    <p className="card-text">Card content</p>
  </div>
</div>

// Navigation with brand colors
<nav className="navbar navbar-light bg-white">
  <a className="navbar-brand text-primary">GearUp</a>
</nav>
```

### React Components with Color Palette

```jsx
const MyComponent = () => (
  <div
    style={{
      backgroundColor: "var(--color-dark-navy)",
      color: "var(--color-text-main)",
      padding: "1rem",
      border: "1px solid var(--color-border)",
    }}
  >
    Brand Styled Component
  </div>
);
```

## 🎯 Recommended Color Combinations

### Headers & Navigation

- Background: `#0A0F1C` (Dark Navy)
- Text: `#FFFFFF` (White)
- Accent: `#007BFF` (Primary Blue)
- Links: `#00AEEF` (Accent Blue)

### Cards & Content

- Background: `#E0E0E0` (Soft Gray)
- Border: `#C0C0C0` (Metallic Silver)
- Title: `#FFFFFF` (White)
- Text: `#C0C0C0` (Metallic Silver)

### Buttons

- **Primary**: Background `#007BFF`, Hover `#00AEEF`, Text `#FFFFFF`
- **Secondary**: Background `#C0C0C0`, Hover `#A0A0A0`, Text `#101010`
- **Outline**: Border `#007BFF`, Text `#007BFF`, Hover Background `#007BFF`

### Forms

- Background: `#E0E0E0` (Soft Gray)
- Input Background: `#FFFFFF` (White)
- Input Border: `#C0C0C0` (Metallic Silver)
- Labels: `#C0C0C0` (Metallic Silver)
- Focus: `#007BFF` (Primary Blue)

### Status Colors

- **Success**: `#28A745` (Green)
- **Warning**: `#FFC107` (Yellow)
- **Error**: `#DC3545` (Red)
- **Info**: `#00AEEF` (Accent Blue)

## 🌙 Dark Theme Support

Your palette is designed for dark themes:

- Primary backgrounds use Dark Navy (`#0A0F1C`) and Jet Black (`#101010`)
- Text uses white (`#FFFFFF`) and metallic silver (`#C0C0C0`)
- Brand colors (`#007BFF`, `#00AEEF`) provide excellent contrast

## 📱 Responsive Considerations

- Blue colors maintain vibrancy across all screen sizes
- Metallic silver provides elegant accents on both mobile and desktop
- High contrast ensures readability on all devices

## ♿ Accessibility

Color combinations provide excellent accessibility:

- White text on dark navy: High contrast ratio
- Blue buttons on dark backgrounds: Excellent visibility
- Metallic silver text: Good readability for secondary content

## 🔧 Integration Steps

1. **CSS Variables**: Already defined in your `index.css` file
2. **Bootstrap Integration**: Use `btn-primary` class for primary blue buttons
3. **Custom Styling**: Apply CSS variables with `var(--color-name)`
4. **Consistent Usage**: Follow the recommended combinations

## 🎨 Color Psychology

Your color palette conveys:

- **Primary Blue (`#007BFF`)**: Trust, reliability, professionalism
- **Accent Blue (`#00AEEF`)**: Innovation, technology, forward-thinking
- **Metallic Silver (`#C0C0C0`)**: Sophistication, premium quality, elegance
- **Dark Navy (`#0A0F1C`)**: Depth, stability, luxury

This palette reinforces GearUp's positioning as a trustworthy, professional, and innovative consulting platform.

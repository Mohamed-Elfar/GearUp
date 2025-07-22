// Color Palette extracted from GearUp Logo
// These colors work harmoniously together and maintain brand consistency

export const colorPalette = {
  // Primary Colors (from logo)
  primary: {
    darkBlue: "#2C5F7A", // Deep blue from logo
    mediumBlue: "#4A7C95", // Medium blue shade
    lightBlue: "#6B9BB0", // Lighter blue variation
    teal: "#4A8B8B", // Teal from logo
    darkTeal: "#3A7070", // Darker teal
    lightTeal: "#5BA0A0", // Lighter teal
  },

  // Neutral Colors (grays from logo)
  neutral: {
    charcoal: "#2D2D2D", // Dark gray/black from logo
    darkGray: "#404040", // Medium dark gray
    mediumGray: "#606060", // Medium gray
    lightGray: "#808080", // Light gray
    silver: "#A0A0A0", // Silver gray
    lightSilver: "#C0C0C0", // Very light gray
  },

  // Extended Palette (complementary colors)
  extended: {
    // Warm accents (complementary to cool blues/teals)
    warmAccent: "#B8860B", // Golden accent
    lightWarm: "#DAA520", // Light golden

    // Success/Error states
    success: "#22C55E", // Green
    warning: "#F59E0B", // Amber
    error: "#EF4444", // Red
    info: "#3B82F6", // Blue info
  },

  // Background variations
  backgrounds: {
    primary: "#F8FAFC", // Very light gray-blue
    secondary: "#F1F5F9", // Light gray
    accent: "#E2E8F0", // Medium light gray
    dark: "#1E293B", // Dark background
    card: "#FFFFFF", // White cards
  },

  // Text colors
  text: {
    primary: "#1E293B", // Dark text
    secondary: "#475569", // Medium text
    muted: "#64748B", // Muted text
    light: "#94A3B8", // Light text
    inverse: "#F8FAFC", // Light text on dark bg
  },

  // Border colors
  borders: {
    light: "#E2E8F0", // Light borders
    medium: "#CBD5E1", // Medium borders
    dark: "#94A3B8", // Dark borders
  },

  // Gradient combinations
  gradients: {
    primaryBlue: "linear-gradient(135deg, #2C5F7A 0%, #4A7C95 100%)",
    tealBlue: "linear-gradient(135deg, #4A8B8B 0%, #2C5F7A 100%)",
    subtleGray: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
    darkGradient: "linear-gradient(135deg, #1E293B 0%, #2D2D2D 100%)",
  },
};

// Tailwind CSS custom colors configuration
export const tailwindColors = {
  "brand-blue": {
    50: "#F0F7FA",
    100: "#E1EFF4",
    200: "#C3DFEA",
    300: "#A5CFDF",
    400: "#87BFD5",
    500: "#4A7C95",
    600: "#2C5F7A",
    700: "#22485C",
    800: "#17313D",
    900: "#0B1A1F",
  },
  "brand-teal": {
    50: "#F0F7F7",
    100: "#E1EFEF",
    200: "#C3DFDF",
    300: "#A5CFCF",
    400: "#87BFBF",
    500: "#4A8B8B",
    600: "#3A7070",
    700: "#2A5454",
    800: "#1A3838",
    900: "#0A1C1C",
  },
  "brand-gray": {
    50: "#F8F8F8",
    100: "#F1F1F1",
    200: "#E3E3E3",
    300: "#D5D5D5",
    400: "#C7C7C7",
    500: "#606060",
    600: "#404040",
    700: "#2D2D2D",
    800: "#1A1A1A",
    900: "#0D0D0D",
  },
};

// Usage examples and combinations
export const colorCombinations = {
  // Header/Navigation
  header: {
    background: colorPalette.primary.darkBlue,
    text: colorPalette.text.inverse,
    accent: colorPalette.primary.teal,
  },

  // Cards
  card: {
    background: colorPalette.backgrounds.card,
    border: colorPalette.borders.light,
    title: colorPalette.text.primary,
    content: colorPalette.text.secondary,
  },

  // Buttons
  primaryButton: {
    background: colorPalette.primary.darkBlue,
    hover: colorPalette.primary.mediumBlue,
    text: colorPalette.text.inverse,
  },

  secondaryButton: {
    background: colorPalette.primary.teal,
    hover: colorPalette.primary.darkTeal,
    text: colorPalette.text.inverse,
  },

  // Forms
  form: {
    background: colorPalette.backgrounds.primary,
    inputBg: colorPalette.backgrounds.card,
    inputBorder: colorPalette.borders.medium,
    label: colorPalette.text.secondary,
  },

  // Feedback Widget (matches your current dark theme)
  feedbackWidget: {
    background: colorPalette.neutral.charcoal,
    panel: colorPalette.neutral.darkGray,
    text: colorPalette.text.inverse,
    accent: colorPalette.primary.lightBlue,
  },
};

export default colorPalette;

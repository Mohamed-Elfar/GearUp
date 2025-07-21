// Color Palette for GearUp
// These colors work harmoniously together and maintain brand consistency

export const colorPalette = {
  // Primary Colors
  primary: {
    blue: "#007BFF", // Primary Blue
    accent: "#00AEEF", // Accent Blue
    silver: "#C0C0C0", // Metallic Silver
  },

  // Background Colors
  backgrounds: {
    darkNavy: "#0A0F1C", // Dark Navy
    softGray: "#E0E0E0", // Soft Gray
    jetBlack: "#101010", // Jet Black
  },

  // Text Colors
  text: {
    main: "#FFFFFF", // White text
    secondary: "#C0C0C0", // Silver text
    link: "#00AEEF", // Accent Blue for links
    linkHover: "#007BFF", // Primary Blue for hover
  },

  // Utility Colors
  utility: {
    border: "#C0C0C0", // Silver borders
    cardBg: "#E0E0E0", // Soft Gray card backgrounds
  },

  // Status Colors
  status: {
    success: "#28A745", // Green
    warning: "#FFC107", // Amber
    error: "#DC3545", // Red
    info: "#00AEEF", // Accent Blue for info
  },
};

// Tailwind CSS custom colors configuration
export const tailwindColors = {
  "brand-blue": {
    50: "#E6F3FF",
    100: "#CCE7FF",
    200: "#99CFFF",
    300: "#66B7FF",
    400: "#339FFF",
    500: "#007BFF", // Primary Blue
    600: "#0056CC",
    700: "#004199",
    800: "#002B66",
    900: "#001533",
  },
  "brand-accent": {
    50: "#E6F8FF",
    100: "#CCF1FF",
    200: "#99E3FF",
    300: "#66D5FF",
    400: "#33C7FF",
    500: "#00AEEF", // Accent Blue
    600: "#008BC4",
    700: "#006899",
    800: "#00456E",
    900: "#002243",
  },
  "brand-silver": {
    50: "#F7F7F7",
    100: "#EEEEEE",
    200: "#DEDEDE",
    300: "#CDCDCD",
    400: "#BCBCBC",
    500: "#C0C0C0", // Metallic Silver
    600: "#9A9A9A",
    700: "#737373",
    800: "#4D4D4D",
    900: "#262626",
  },
};

// Usage examples and combinations
export const colorCombinations = {
  // Header/Navigation
  header: {
    background: colorPalette.backgrounds.darkNavy,
    text: colorPalette.text.main,
    accent: colorPalette.primary.accent,
  },

  // Cards
  card: {
    background: colorPalette.utility.cardBg,
    border: colorPalette.utility.border,
    title: colorPalette.backgrounds.jetBlack,
    content: colorPalette.text.secondary,
  },

  // Buttons
  primaryButton: {
    background: colorPalette.primary.blue,
    hover: colorPalette.primary.accent,
    text: colorPalette.text.main,
  },

  secondaryButton: {
    background: colorPalette.primary.silver,
    hover: colorPalette.backgrounds.softGray,
    text: colorPalette.backgrounds.jetBlack,
  },

  // Forms
  form: {
    background: colorPalette.backgrounds.softGray,
    inputBg: colorPalette.text.main,
    inputBorder: colorPalette.utility.border,
    label: colorPalette.backgrounds.jetBlack,
  },

  // Dark theme sections
  darkSection: {
    background: colorPalette.backgrounds.darkNavy,
    panel: colorPalette.backgrounds.jetBlack,
    text: colorPalette.text.main,
    accent: colorPalette.primary.accent,
  },
};

export default colorPalette;

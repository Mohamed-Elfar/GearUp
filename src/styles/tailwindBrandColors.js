// Tailwind CSS Brand Colors Extension
// Add this to your tailwind.config.js file

const brandColors = {
  // Primary brand colors from logo
  'brand-blue': {
    50: '#F0F7FA',
    100: '#E1EFF4', 
    200: '#C3DFEA',
    300: '#A5CFDF',
    400: '#87BFD5',
    500: '#6B9BB0',  // light blue
    600: '#4A7C95',  // medium blue
    700: '#2C5F7A',  // dark blue (primary)
    800: '#22485C',
    900: '#17313D',
  },
  
  'brand-teal': {
    50: '#F0F7F7',
    100: '#E1EFEF',
    200: '#C3DFDF', 
    300: '#A5CFCF',
    400: '#87BFBF',
    500: '#5BA0A0',  // light teal
    600: '#4A8B8B',  // primary teal
    700: '#3A7070',  // dark teal
    800: '#2A5454',
    900: '#1A3838',
  },
  
  'brand-neutral': {
    50: '#F8F8F8',
    100: '#F1F1F1',
    200: '#E3E3E3',
    300: '#D5D5D5', 
    400: '#C0C0C0',  // light silver
    500: '#A0A0A0',  // silver
    600: '#808080',  // light gray
    700: '#606060',  // medium gray
    800: '#404040',  // dark gray
    900: '#2D2D2D',  // charcoal
  },

  // Extended palette
  'brand-accent': {
    warm: '#B8860B',
    'warm-light': '#DAA520',
  }
};

// Usage in tailwind.config.js:
const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        ...brandColors,
        
        // Semantic color mappings
        primary: brandColors['brand-blue'][700],     // #2C5F7A
        secondary: brandColors['brand-teal'][600],   // #4A8B8B
        accent: brandColors['brand-accent'].warm,    // #B8860B
        
        // Background variations
        'bg-brand': '#F8FAFC',
        'bg-brand-secondary': '#F1F5F9',
        'bg-brand-accent': '#E2E8F0',
        
        // Text variations
        'text-brand': '#1E293B',
        'text-brand-secondary': '#475569',
        'text-brand-muted': '#64748B',
      },
      
      gradientColorStops: {
        'brand-blue-start': brandColors['brand-blue'][700],
        'brand-blue-end': brandColors['brand-blue'][600], 
        'brand-teal-start': brandColors['brand-teal'][600],
        'brand-teal-end': brandColors['brand-blue'][700],
      },
      
      boxShadow: {
        'brand': '0 4px 6px -1px rgba(44, 95, 122, 0.1), 0 2px 4px -1px rgba(44, 95, 122, 0.06)',
        'brand-teal': '0 4px 6px -1px rgba(74, 139, 139, 0.1), 0 2px 4px -1px rgba(74, 139, 139, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(44, 95, 122, 0.1), 0 4px 6px -2px rgba(44, 95, 122, 0.05)',
      },
      
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2C5F7A 0%, #4A7C95 100%)',
        'gradient-brand-teal': 'linear-gradient(135deg, #4A8B8B 0%, #2C5F7A 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      }
    }
  }
};

export { brandColors, tailwindConfig };

// Example usage in components:
/*
// Buttons
<button className="bg-brand-blue-700 hover:bg-brand-blue-600 text-white">
  Primary Button
</button>

<button className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white">
  Secondary Button  
</button>

// Cards
<div className="bg-white border border-brand-neutral-200 shadow-brand rounded-lg">
  Brand Card
</div>

// Gradients
<div className="bg-gradient-brand text-white">
  Gradient Background
</div>

// Text colors
<h1 className="text-brand-blue-700">Brand Heading</h1>
<p className="text-brand-neutral-700">Brand Text</p>
*/

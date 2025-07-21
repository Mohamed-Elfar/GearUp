import { brandColors } from './src/styles/tailwindBrandColors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...brandColors,
        
        // Semantic color mappings using brand colors
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
    },
  },
  plugins: [],
}

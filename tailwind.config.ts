import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surface colors
        'surface-dim': '#121318',
        'surface': '#121318',
        'surface-bright': '#38393f',
        'surface-container-lowest': '#0d0e13',
        'surface-container-low': '#1a1b21',
        'surface-container': '#1e1f25',
        'surface-container-high': '#292a2f',
        'surface-container-highest': '#34343a',
        'surface-tint': '#00dbe9',
        
        // On-surface colors
        'on-surface': '#e3e1e9',
        'on-surface-variant': '#b9cacb',
        
        // Primary (Cyan/Turquoise)
        'primary-fixed': '#7df4ff',
        'primary-fixed-dim': '#00dbe9',
        'primary-container': '#00f0ff',
        'primary': '#dbfcff',
        'on-primary': '#00363a',
        'on-primary-fixed': '#002022',
        'on-primary-fixed-variant': '#004f54',
        'on-primary-container': '#006970',
        'inverse-primary': '#006970',
        
        // Secondary (Purple/Blue)
        'secondary-fixed': '#dee0ff',
        'secondary-fixed-dim': '#bac3ff',
        'secondary-container': '#2c3ea3',
        'secondary': '#bac3ff',
        'on-secondary': '#08218a',
        'on-secondary-fixed': '#00105c',
        'on-secondary-fixed-variant': '#293ca0',
        'on-secondary-container': '#a8b4ff',
        
        // Tertiary (Purple)
        'tertiary-fixed': '#e9ddff',
        'tertiary-fixed-dim': '#d1bcff',
        'tertiary-container': '#e1d2ff',
        'tertiary': '#faf3ff',
        'on-tertiary': '#3c0090',
        'on-tertiary-fixed': '#23005b',
        'on-tertiary-fixed-variant': '#5700c9',
        'on-tertiary-container': '#7213ff',
        
        // Error
        'error-container': '#93000a',
        'error': '#ffb4ab',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',
        
        // Additional
        'outline': '#849495',
        'outline-variant': '#3b494b',
        'background': '#121318',
        'on-background': '#e3e1e9',
        'inverse-surface': '#e3e1e9',
        'inverse-on-surface': '#2f3036',
      },
      
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      
      borderRadius: {
        slight: '0.25rem',
        compact: '0.5rem',
        small: '0.75rem',
        medium: '1rem',
        large: '1.5rem',
        xlarge: '2rem',
      },
      
      backdropBlur: {
        md: '16px',
      },
      
      boxShadow: {
        'glass': 'inset 1px 1px rgba(255, 255, 255, 0.2)',
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.2)',
        'glow-purple': '0 0 20px rgba(169, 102, 255, 0.2)',
      },
      
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
}

export default config

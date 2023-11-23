/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'custom-pink': '#DADAFB',
        'custom-blue': '#1400FF',
        'custom-purple': '#5E17EB',
        'gray-border': '#E5E5E5',
        'primary': '#D80032'
      },
      maxWidth: {
        'normal': '1200px',
        'large': '2100px'
      },
      fontFamily: {
        satoshi: ['var(--font-satoshi)'],
        'title': ['League Gothic', 'sans-serif'],
        'body': ['Space Mono', 'monospace']
      },
      boxShadow: {
        'box': '0px 2px 6px 0px rgba(16, 24, 40, 0.06)',
      }
    },
    screens: {
      md: '768px',
      ld: '1024px'
    }
  },
  plugins: []
}

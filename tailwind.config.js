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
      }, 
      maxWidth:{
        'normal':'1200px', 
        'large':'2100px'
      }
    },
    screens: {
      md: '768px',
      ld: '1024px'
    }
  },
  plugins: []
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body:    ['Inter',  'sans-serif'],
      },
      colors: {
        viper: {
          50:  '#f5f0ff',
          200: '#d4b3ff',
          400: '#a855f7',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#3b0764',
          950: '#1e0338',
        },
        dark: {
          50:  '#1a0a2e',
          100: '#130720',
          200: '#0d0515',
          300: '#080210',
          500: '#000000',
        },
      },
      backgroundImage: {
        'viper-gradient': 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        'hero-radial':    'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 60%)',
      },
      boxShadow: {
        'viper':      '0 0 0 1px rgba(139,92,246,0.35)',
        'viper-lg':   '0 8px 40px rgba(139,92,246,0.35)',
        'viper-glow': '0 0 40px rgba(139,92,246,0.4)',
        'card':       '0 8px 48px rgba(0,0,0,0.7)',
      },
      animation: {
        'fade-up':  'fadeUp 0.55s ease forwards',
        'fade-in':  'fadeIn 0.4s ease forwards',
        'float':    'float 5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from:{opacity:'0',transform:'translateY(16px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        fadeIn: { from:{opacity:'0'}, to:{opacity:'1'} },
        float:  { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-8px)'} },
      },
    },
  },
  plugins: [],
}

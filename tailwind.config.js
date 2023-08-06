/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts}"
  ],
  theme: {
    fontSize: {
      base: '10px',
    },
    extend: {
      colors: {
        'main-color': '#008000',
        'main-color-light': '#90ee90',
        'main-color-dark': '#006400',
        'main-background-color': '#000000',
        'main-background-color-deep': '#141414',
        // 修改以上颜色时须注意同步到base.css
      },
      fontSize: {
        'common-size': '2rem',
      },
      padding: {
        'main-wrap': '1rem',
      }
    },
  },
  plugins: [],
}


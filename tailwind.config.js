export default {
  content: [
    './pages/**/*.vue',
    './components/**/*.vue',
    './layouts/**/*.vue'
  ],
  theme: {
    extend: {
      screens: {
        xxl: '1920px',
        xl: {
          max: '1439px'
        },
        lg: {
          max: '1279px'
        },
        md: {
          max: '1023px'
        },
        sm: {
          max: '767px'
        }
      },
    }
  },
}
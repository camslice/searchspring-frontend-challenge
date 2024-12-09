import daisyui from 'daisyui';

const palette = {
  primary: '#e45c52',
  'primary-content': '#fef3c7',
  secondary: '#155e75',
  'secondary-content': '#ecfccb',
  accent: '#2dd4bf',
  neutral: '39405b',
  'base-content': '#374151',
};

// prettier-ignore
const fontSans = [
  'Roboto',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Oxygen-Sans',
  'Ubuntu',
  'Cantarell',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

export default {
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        decal: {
          'color-scheme': 'light',
          fontFamily: fontSans.join(','),
          ...palette,
          'base-100': '#ffffff',
          '--rounded-box': '0', // border radius rounded-box utility class, used in card and other large boxes
          '--rounded-btn': '0', // border radius rounded-btn utility class, used in buttons and similar element
          '--rounded-badge': '1.9rem', // border radius rounded-badge utility class, used in badges and similar
          '--animation-btn': '0.25s', // duration of animation when you click on button
          '--animation-input': '0.2s', // duration of animation for inputs like checkbox, toggle, radio, etc
          '--btn-focus-scale': '1', // scale transform of button when you focus on it
          '--border-btn': '0', // border width of buttons
          '--tab-border': '0', // border width of tabs
          '--tab-radius': '0', // border radius of tabs
        },
      },
    ],
  },
};

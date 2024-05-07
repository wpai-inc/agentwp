let prefixOverrideList = ['html', 'body'];

export default {
  plugins: {
    tailwindcss: {},
    'postcss-prefix-selector': {
      prefix: 'div[id^="agent-wp"]',
      transform: function (prefix, selector, prefixedSelector, filePath, rule) {
        if (process.env['STORYBOOK_ENV'] === '1') {
          return selector;
        }
        if (prefixOverrideList.includes(selector)) {
          return prefix;
        } else {
          return prefixedSelector;
        }
      }
    },
    autoprefixer: {},
  },
}

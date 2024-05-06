import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    // actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  globalTypes: {
    darkMode: {
      defaultValue: true,
    },
  },
};

const storybookRoot = document.getElementById('storybook-root');
const moConfig = { attributes: true, childList: false, subtree: false };

const mo = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'attributes') {
      const classes = mutation.target?.classList;
      // if it containes the dark class, add the dark class to the body
      if (classes?.contains('dark')) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }
});

if (storybookRoot) {
  mo.observe(storybookRoot, moConfig);
}

export const parameters = {};
export default preview;

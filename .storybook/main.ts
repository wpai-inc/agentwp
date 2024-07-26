import { mergeConfig } from 'vite';
import { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../client/Components/**/*.mdx',
    '../client/Components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: ['../client'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: './vite.storybook.config.ts',
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen',
    reactDocgenTypescriptOptions: {},
    skipCompiler: true,
  },
  viteFinal: async (config) => {
    if(config.plugins) {
      config.plugins = config.plugins.filter((plugin) => plugin.name !== 'v4wp');
    }

    return config;
  },
};

export default config;

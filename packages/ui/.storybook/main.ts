import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx'],
  addons: [
    '@storybook/addon-docs',
    { name: '@storybook/addon-a11y', options: { element: '#storybook-root' } },
    { name: '@storybook/addon-mcp', options: { toolsets: { dev: true, docs: true, test: true } } },
  ],
  features: { developmentModeForBuild: false },
};

export default config;

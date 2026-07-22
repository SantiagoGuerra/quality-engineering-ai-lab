import eslint from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', '**/reports/**', '**/playwright-report/**', '**/test-results/**', '**/storybook-static/**', 'tests/security/fixtures/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  },
  {
    files: ['scripts/**/*.ts', 'tests/**/*.ts', '**/*.config.ts'],
    rules: { 'no-console': 'off' }
  },
  {
    files: ['tests/performance/**/*.js'],
    languageOptions: { globals: { __ENV: 'readonly' } }
  }
);

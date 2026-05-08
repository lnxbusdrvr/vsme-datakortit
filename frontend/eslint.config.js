/*
 * This eslint is mainly ChatGPT AI Generated
 * Because fullstackopen.com had older eslint config
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  js.configs.recommended,
  {
    ignores: ['node_modules', 'dist', 'vite.config.js']
  },
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      unicorn
    },
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    rules: {
      'semi': ['error', 'never'],
      'no-console': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'react/prop-types': 'off',
      'no-undef': 'error',
      'quotes': [2, 'single', { avoidEscape: true }],
      'comma-dangle': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'react-refresh/only-export-components': 'warn',
      'unicorn/catch-error-name': ['error', { name: 'error' }]

    }
  },
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        // globals.jest is also for vitest
        ...globals.jest
      }
    },
    rules: {
      'jest/expact-expect': 'off'
    }
  }
])

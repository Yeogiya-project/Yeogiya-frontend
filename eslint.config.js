import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'eslint.config.js'],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReactConfig,
    files: ['**/*.{ts,tsx}'],
    languageOptions: { ...pluginReactConfig.languageOptions, globals: globals.browser },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReactJsxRuntime,
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
        'react/prop-types': 'off',
    }
  }
);

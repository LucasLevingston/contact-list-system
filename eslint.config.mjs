import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import rocketseatConfig from '@rocketseat/eslint-config/node.js'
/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  { languageOptions: { globals: globals.browser } },
  {
    extends: rocketseatConfig,
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]

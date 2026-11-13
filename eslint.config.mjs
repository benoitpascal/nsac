import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    plugins: { 'import-x': importX },
    rules: {
      'import-x/no-commonjs': 'warn',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          'newlines-between': 'never',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'func-style': ['error', 'expression'],
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'max-lines': ['warn', { max: 70, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'import', format: null },
        { selector: 'objectLiteralProperty', format: null },
        { selector: 'typeProperty', format: null },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            ':matches(Literal[raw=/&#?[a-zA-Z0-9]+;/], TemplateElement[value.raw=/&#?[a-zA-Z0-9]+;/])',
          message: 'Unicode natif — jamais d’entités HTML (écrire \' " é).',
        },
        {
          selector:
            ':matches(ImportDeclaration, ExportNamedDeclaration, ExportAllDeclaration, ImportExpression)[source.value=/\\.(js|ts)$/]',
          message: 'Pas d’extension .js/.ts dans les imports.',
        },
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: { '@typescript-eslint/consistent-type-definitions': 'off' },
  },
  {
    files: ['**/ui/**'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        { patterns: ['**/infra/**', '@/**/infra/**'] },
      ],
    },
  },
  {
    files: ['**/infra/**'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['**/ui/**', '@/**/ui/**'] },
            { group: ['**/core/**', '@/**/core/**'], allowTypeImports: true },
          ],
        },
      ],
    },
  },
  {
    files: ['**/core/**'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        { patterns: ['**/ui/**', '@/**/ui/**'] },
      ],
    },
  },
  { ignores: ['dist/', 'node_modules/'] },
];

export default eslintConfig;

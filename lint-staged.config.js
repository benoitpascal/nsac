export default {
  'src/**/*.ts': ['eslint --fix', 'prettier --write', () => 'tsc --noEmit'],
  '*.{css,json}': ['prettier --write'],
};

require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  ignorePatterns: ['**/src/**/*.spec.ts', '**/src/**/*.spec.tsx'],
  parserOptions: { tsconfigRootDir: __dirname }
};

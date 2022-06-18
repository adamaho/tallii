module.exports = {
  ...require('@tallii/config/eslint-server'),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.lint.json'],
  },
}

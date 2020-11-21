module.exports = {
  plugins: ["prettier"],

  env: {
    es6: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    jsx: true,
  },

  extends: ["eslint:recommended", "prettier"],

  rules: {
    "no-console": "warn",
    "no-var": "error",
    "prettier/prettier": "error",
  },
}

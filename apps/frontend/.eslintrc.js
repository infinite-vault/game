module.exports = {
  root: true,
  extends: ["custom"],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es6: true,
    serviceworker: true,
  },
};

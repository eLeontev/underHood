module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint', 'prettier'],
    env: {
        browser: true,
        jasmine: true,
        jest: true,
    },
    rules: {
        'prettier/prettier': 'error',
    },
    parser: '@typescript-eslint/parser',
};

const { defaults } = require('jest-config');

module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.ts?$': 'babel-jest',
    },
};

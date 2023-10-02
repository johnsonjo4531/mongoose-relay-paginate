/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "json",
    "js"
  ],
};

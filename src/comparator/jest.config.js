module.exports = {
  displayName: 'comparator',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'babel-jest'
  }
};
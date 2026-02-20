const nextJest = require('next/jest');
const fs = require('fs');
const path = require('path');

const createJestConfig = nextJest({
    dir: './',
});

function getFilesWithTests() {
  const sourceFiles = [];
  const srcDir = './src';
  
  const walk = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.spec.tsx') || file.endsWith('.spec.ts')) {
        const sourceFile = file.replace('.spec.', '.');
        const sourceDir = path.dirname(fullPath);
        sourceFiles.push(`${sourceDir}/${sourceFile}`);
      }
    });
  };
  
  walk(srcDir);
  return sourceFiles;
}

const config = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: getFilesWithTests(),
    coverageReporters: ['text', 'text-summary', 'html'],
    coverageThreshold: {
        global: {
            statements: 75,
            branches: 75,
            functions: 75,
            lines: 70,
        },
    },
}

module.exports = createJestConfig(config);
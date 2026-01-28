# Mobile App - Dependency Notes

## Installation

Always use `--legacy-peer-deps` when installing or updating packages:

```bash
npm install --legacy-peer-deps
```

This is needed because:
- React Native 0.79.6 requires React 18.x
- Expo Router 5.x has peer dependencies that may conflict
- Using `--legacy-peer-deps` ensures compatibility

## Current Versions

- React: 18.3.1
- React Native: 0.79.6
- Expo: 53.0.7
- Expo Router: 5.1.10
- Firebase: 11.1.0

All dependencies are successfully installed and working!

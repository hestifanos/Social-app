# Social App — Expo Starter

An Expo and React Native starter project with file-based routing, themed tab screens, and shared UI components. The checked-in screens are still the Expo starter examples; social features have not yet been implemented.

## Requirements

- Node.js and npm
- Expo-compatible Android or iOS development environment, or a browser for web preview

## Install and run

```bash
npm install
npm start
```

Use the Expo CLI prompts to open an Android emulator, iOS simulator, Expo Go, or web preview. Available convenience commands:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

## Structure

```text
app/             Expo Router routes and tabs
components/      Reusable themed UI components
hooks/           Shared React hooks
assets/          Fonts and images
```

The project also includes Firebase and notification dependencies; configure and secure the corresponding services before adding those features or shipping a build.

# TicTacToeParty

A modern Tic Tac Toe game built with React Native, featuring retro-style graphics and sound effects.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or newer)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

## Installation

1. Clone the repository:
```bash
git clone git@github.com:demanda1/TicTacToeParty.git
cd TicTacToeParty
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install iOS dependencies (iOS only):
```bash
cd ios
pod install
cd ..
```

## Running the App

### iOS
```bash
# Start the Metro bundler
npm start
# or
yarn start

# In a new terminal, run the iOS app
npm run ios
# or
yarn ios
```

### Android
```bash
# Start the Metro bundler
npm start
# or
yarn start

# In a new terminal, run the Android app
npm run android
# or
yarn android
```

## Development

- The app is built using React Native and Expo
- Main game logic is in `App.tsx`
- Assets (images, audio, fonts) are stored in the `assets` directory
- The app uses custom fonts and audio files for an enhanced gaming experience

## Features

- Classic Tic Tac Toe gameplay
- Retro-style graphics and animations
- Background music and sound effects
- Responsive design for both iOS and Android
- Custom fonts and UI elements

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are properly installed
2. Clear Metro bundler cache:
```bash
npm start -- --reset-cache
# or
yarn start -- --reset-cache
```

3. For iOS, try cleaning the build:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

4. For Android, try cleaning the build:
```bash
cd android
./gradlew clean
cd ..
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
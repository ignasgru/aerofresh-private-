# 🚀 Expo Go Setup for AeroFresh Mobile App

## Prerequisites

1. **Install Expo Go on your mobile device:**
   - **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - **Android**: Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Make sure your phone and computer are on the same WiFi network**

## Quick Start

1. **Navigate to the mobile app directory:**

   ```bash
   cd apps/mobile
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the Expo development server:**

   ```bash
   pnpm start
   ```

4. **Open the app on your device:**
   - **Option 1**: Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
   - **Option 2**: Use the Expo Go app to scan the QR code directly

## Development Commands

```bash
# Start Expo development server
pnpm start

# Start with tunnel (for remote access)
pnpm start --tunnel

# Start on localhost only
pnpm start --localhost

# Clear cache and start
pnpm start --clear

# Open in iOS simulator (if you have Xcode)
pnpm start --ios

# Open in Android emulator (if you have Android Studio)
pnpm start --android
```

## App Features

Your AeroFresh mobile app includes:

- ✈️ **Aircraft Search**: Search for aircraft by tail number
- 📊 **Aircraft Summary**: View detailed aircraft information
- 📈 **Aircraft History**: Complete ownership and accident history
- 🎨 **Modern UI**: Clean, professional design with blue theme
- 📱 **Responsive**: Optimized for mobile devices

## Troubleshooting

### QR Code Not Working

- Make sure both devices are on the same WiFi network
- Try using the `--tunnel` option for remote access
- Restart the Expo development server

### App Not Loading

- Check that all dependencies are installed: `pnpm install`
- Clear cache: `pnpm start --clear`
- Check for any error messages in the terminal

### Network Issues

- Use `--localhost` if you're having network issues
- Try `--tunnel` for accessing from different networks

## Development Tips

1. **Hot Reload**: Changes to your code will automatically reload in the app
2. **Debugging**: Use the Expo Go app's built-in debugging tools
3. **Shake to Debug**: Shake your device to open the developer menu
4. **Remote Debugging**: Enable remote debugging in the developer menu

## Project Structure

```text
apps/mobile/
├── App.tsx                 # Main app component with navigation
├── expo.json              # Expo configuration
├── assets/                # App icons and splash screens
│   ├── icon.svg
│   ├── splash.svg
│   ├── adaptive-icon.svg
│   └── favicon.svg
└── src/
    └── screens/
        ├── SearchScreen.tsx
        ├── TailSummaryScreen.tsx
        └── AircraftHistoryScreen.tsx
```

## Next Steps

1. **Test the app** by searching for aircraft tail numbers
2. **Customize the UI** by modifying the screen components
3. **Add new features** by creating additional screens
4. **Deploy** using Expo's build service when ready

Happy coding! 🎉

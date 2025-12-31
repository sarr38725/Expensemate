# Quick Start Guide

Get your ExpenseMate React Native app running in minutes!

## Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native
- Expo SDK
- Navigation libraries
- Supabase client
- UI components
- And more...

### 2. Database Setup

The Supabase database is already configured and ready to use! The following has been automatically set up:

- ✅ Transactions table created
- ✅ Row Level Security (RLS) enabled
- ✅ Security policies configured
- ✅ Indexes for optimal performance

### 3. Start the Development Server

```bash
npm start
```

This will start the Expo development server and show a QR code.

### 4. Run on Your Device

You have several options:

#### Option A: Physical Device (Recommended for Testing)

1. Install **Expo Go** app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code displayed in your terminal

3. The app will load on your device

#### Option B: iOS Simulator (Mac only)

```bash
# Press 'i' in the terminal after running npm start
# Or run:
npm run ios
```

#### Option C: Android Emulator

```bash
# Press 'a' in the terminal after running npm start
# Or run:
npm run android
```

#### Option D: Web Browser

```bash
# Press 'w' in the terminal after running npm start
# Or run:
npm run web
```

## First Launch

When you first launch the app:

1. **Welcome Screen:** You'll see the onboarding screen
2. **Setup:** The app will initialize with default settings
3. **Ready to Use:** Start adding your first transaction!

## Default User Setup

The app uses email-based user identification. On first launch:
- A guest email (`guest@expensemate.com`) is used by default
- You can change this in the Settings screen
- All transactions are tied to the user email

## Features to Try

### 1. Add a Transaction
- Tap the **+** floating button on the home screen
- Enter amount, category, and description
- Choose Income or Expense
- Save the transaction

### 2. View Statistics
- Navigate to the **Statistics** tab
- View weekly income vs expense chart
- Filter by category
- Toggle between Income and Expense view

### 3. Set Monthly Budget
- Go to **Profile** → **Settings**
- Enter your monthly budget amount
- Get warnings when you exceed your budget

### 4. Enable PIN Lock
- Go to **Profile** → **Settings**
- Set a 4-digit PIN
- Your app will be locked on next launch

### 5. Change Language
- Go to **Profile** → **Settings**
- Switch between English and বাংলা (Bengali)

## Common Issues and Solutions

### Issue: "Metro bundler not starting"
**Solution:**
```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm start --clear
```

### Issue: "Supabase connection error"
**Solution:** Check that the .env file exists and contains valid Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Issue: "App not loading on device"
**Solution:**
- Make sure your phone and computer are on the same WiFi network
- Try restarting the Expo development server
- Update Expo Go app to the latest version

### Issue: "Icons not showing"
**Solution:**
```bash
# Reinstall dependencies
npm install react-native-vector-icons
npm start --clear
```

## Development Tips

### Hot Reload
- Changes to your code will automatically reload in the app
- Shake your device to open the developer menu
- Enable Fast Refresh for instant updates

### Debugging
- Shake device → "Debug Remote JS"
- Open Chrome DevTools for debugging
- Use `console.log()` statements
- Check React Native debugger

### Testing on Multiple Devices
- Scan the same QR code on multiple devices
- All devices will receive live updates
- Test iOS and Android simultaneously

## Project Structure Overview

```
ExpenseMate/
├── App.js                    # Entry point
├── src/
│   ├── screens/             # All app screens
│   ├── navigation/          # Navigation setup
│   ├── config/              # Supabase config
│   ├── utils/               # Helper functions
│   └── localization/        # Translations
├── assets/                  # Images and icons
└── package.json             # Dependencies
```

## Next Steps

1. **Customize Categories:** Edit the categories in `AddTransactionScreen.js`
2. **Change Theme Colors:** Modify styles in each screen file
3. **Add More Languages:** Create new JSON files in `src/localization/`
4. **Enhance Charts:** Explore react-native-chart-kit options

## Need Help?

- Check `README.md` for detailed documentation
- Review `CONVERSION_GUIDE.md` to understand the architecture
- Explore the source code in `src/` directory
- All components are well-commented

## Building for Production

When you're ready to build your app:

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Standalone Apps
Follow [Expo's build documentation](https://docs.expo.dev/build/setup/) for creating standalone apps.

---

**Happy Coding! 🚀**

Your ExpenseMate app is now ready to track all your income and expenses!

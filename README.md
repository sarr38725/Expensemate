# ExpenseMate - React Native Edition

A complete expense tracking mobile application built with React Native and Supabase.

## Features

- Track income and expenses with categories
- View transactions filtered by day, week, month, or year
- Monthly budget management with warnings
- Weekly statistics with bar charts
- Transaction history with search and edit capabilities
- PIN lock protection
- Profile management with photo upload
- Bilingual support (English and Bengali)
- Balance summary and reports

## Tech Stack

- **React Native** with Expo
- **Supabase** for database and backend
- **React Navigation** for routing
- **React Native Chart Kit** for statistics charts
- **i18next** for internationalization
- **AsyncStorage** for local data persistence

## Prerequisites

- Node.js 16+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Expo Go app on your mobile device (optional)

## Installation

1. Install dependencies:
```bash
npm install
```

2. The Supabase database has been automatically configured with the transactions table and Row Level Security policies.

## Running the App

Start the development server:
```bash
npm start
```

Then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your device

## Project Structure

```
├── App.js                          # Main app entry point
├── src/
│   ├── config/
│   │   └── supabase.js            # Supabase configuration
│   ├── localization/
│   │   ├── i18n.js                # i18next configuration
│   │   ├── en.json                # English translations
│   │   └── bn.json                # Bengali translations
│   ├── navigation/
│   │   └── MainTabNavigator.js    # Bottom tab navigation
│   ├── screens/
│   │   ├── WelcomeScreen.js       # Onboarding screen
│   │   ├── PinScreen.js           # PIN lock screen
│   │   ├── HomeScreen.js          # Main dashboard
│   │   ├── AddTransactionScreen.js # Add new transaction
│   │   ├── TransactionScreen.js   # Transaction history
│   │   ├── StatisticsScreen.js    # Weekly statistics with charts
│   │   ├── ProfileScreen.js       # User profile
│   │   ├── SettingsScreen.js      # App settings
│   │   └── BalanceSummaryScreen.js # Balance overview
│   └── utils/
│       └── database.js            # Database helper functions
└── assets/
    └── images/                    # App images and icons
```

## Key Features Implementation

### Database Integration
- Supabase for cloud database with automatic sync
- Row Level Security for data protection
- Real-time transaction updates

### Localization
- English and Bengali language support
- Dynamic language switching
- Category names translated

### Security
- PIN protection on app launch
- Secure transaction data with RLS policies
- User-specific data isolation

### UI/UX
- Modern card-based design
- Responsive layouts for all screen sizes
- Smooth animations and transitions
- Pull-to-refresh functionality

## License

MIT License

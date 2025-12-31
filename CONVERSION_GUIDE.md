# Flutter to React Native Conversion Guide

This document outlines the conversion of the ExpenseMate Flutter app to React Native.

## Major Changes

### 1. Framework Migration
- **From:** Flutter (Dart)
- **To:** React Native with Expo (JavaScript)

### 2. Database Migration
- **From:** SQLite (local storage with sqflite package)
- **To:** Supabase (cloud-based PostgreSQL with real-time sync)

### 3. State Management
- **From:** Provider pattern with ChangeNotifier
- **To:** React Hooks (useState, useEffect, useCallback)

### 4. Navigation
- **From:** Flutter's MaterialApp with named routes
- **To:** React Navigation (Stack + Bottom Tabs)

### 5. Localization
- **From:** Flutter's built-in localization with .arb files
- **To:** i18next with JSON translation files

## File Structure Comparison

### Flutter Structure
```
lib/
├── main.dart
├── db/database_helper.dart
├── screens/
│   ├── home_screen.dart
│   ├── add_transaction_screen.dart
│   └── ...
├── generated/app_localizations.dart
└── l10n/
    ├── app_en.arb
    └── app_bn.arb
```

### React Native Structure
```
src/
├── config/supabase.js
├── utils/database.js
├── screens/
│   ├── HomeScreen.js
│   ├── AddTransactionScreen.js
│   └── ...
├── navigation/MainTabNavigator.js
└── localization/
    ├── i18n.js
    ├── en.json
    └── bn.json
```

## Key Component Conversions

### State Management

**Flutter (Provider):**
```dart
class LocaleProvider extends ChangeNotifier {
  Locale _locale = const Locale('en');

  void setLocale(Locale locale) {
    _locale = locale;
    notifyListeners();
  }
}
```

**React Native (Hooks):**
```javascript
const [locale, setLocale] = useState('en');
// State updates automatically trigger re-renders
```

### Database Operations

**Flutter (SQLite):**
```dart
Future<int> addTransaction(amount, category, type, date, desc) async {
  final db = await database;
  return await db.insert('transactions', data);
}
```

**React Native (Supabase):**
```javascript
async addTransaction(amount, category, type, date, description) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{ amount, category, type, date, description }]);
  return data;
}
```

### Navigation

**Flutter:**
```dart
Navigator.pushNamed(context, '/add');
```

**React Native:**
```javascript
navigation.navigate('AddTransaction');
```

### Styling

**Flutter (Widget-based):**
```dart
Container(
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.green.withOpacity(0.1),
    borderRadius: BorderRadius.circular(20),
  ),
  child: Text('Income'),
)
```

**React Native (StyleSheet):**
```javascript
<View style={styles.incomeCard}>
  <Text>Income</Text>
</View>

const styles = StyleSheet.create({
  incomeCard: {
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
  },
});
```

## Feature Parity

### Implemented Features
- ✅ Welcome screen with onboarding
- ✅ PIN lock functionality
- ✅ Home dashboard with transaction filters (today/week/month/year)
- ✅ Add/Edit transactions with categories
- ✅ Monthly budget tracking with warnings
- ✅ Transaction history with search and edit
- ✅ Statistics screen with weekly bar charts
- ✅ Profile management with image picker
- ✅ Settings (budget, PIN, language, notifications)
- ✅ Bilingual support (English/Bengali)
- ✅ Balance summary screen

### Enhancements in React Native Version
- ✅ Cloud-based data storage with Supabase
- ✅ Real-time data synchronization
- ✅ Better cross-platform support (iOS, Android, Web)
- ✅ Improved state management with React Hooks
- ✅ Modern UI with React Native Paper components

### Notable Differences
- **PDF Generation:** Simplified in React Native (basic implementation)
- **CSV Export:** Not yet implemented (can be added)
- **Notifications:** Basic toggle (push notifications require additional setup)

## Dependencies Comparison

### Flutter Dependencies
```yaml
dependencies:
  flutter_localizations
  provider
  shared_preferences
  sqflite
  path_provider
  csv
  fl_chart
  image_picker
  pdf
  printing
```

### React Native Dependencies
```json
{
  "@react-navigation/native": "Navigation framework",
  "@supabase/supabase-js": "Database client",
  "@react-native-async-storage/async-storage": "Local storage",
  "react-native-chart-kit": "Charts",
  "expo-image-picker": "Image selection",
  "i18next": "Internationalization",
  "date-fns": "Date manipulation"
}
```

## Database Schema

### Flutter (SQLite)
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL,
  category TEXT,
  type TEXT,
  date TEXT,
  description TEXT,
  userEmail TEXT
)
```

### React Native (Supabase/PostgreSQL)
```sql
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('Income', 'Expense')),
  date timestamptz NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
)
```

## Running the App

### Flutter
```bash
flutter pub get
flutter run
```

### React Native
```bash
npm install
npm start
# Then press 'i' for iOS or 'a' for Android
```

## Build Process

### Flutter
```bash
flutter build apk
flutter build ios
```

### React Native (Expo)
```bash
expo build:android
expo build:ios
```

## Benefits of React Native Version

1. **Cloud Storage:** Automatic data backup and sync across devices
2. **Cross-Platform:** Single codebase for iOS, Android, and Web
3. **Ecosystem:** Access to npm packages and React ecosystem
4. **Development Speed:** Hot reload, extensive debugging tools
5. **Web Support:** Can run as a Progressive Web App
6. **Community:** Large React/React Native community support

## Migration Checklist

- [x] Project setup and configuration
- [x] Database migration to Supabase
- [x] Authentication and user management
- [x] All screens converted
- [x] Localization system
- [x] Navigation structure
- [x] State management
- [x] Image assets
- [x] Styling and theming
- [x] Testing and debugging

## Next Steps for Enhancement

1. Add push notifications support
2. Implement CSV export functionality
3. Add more chart types (pie charts, line charts)
4. Implement data export to PDF with full formatting
5. Add data import functionality
6. Implement recurring transactions
7. Add expense categories customization
8. Implement budget categories
9. Add financial insights and recommendations
10. Implement dark mode theme

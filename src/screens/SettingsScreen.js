import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [budget, setBudget] = useState('');
  const [pin, setPin] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedBudget = await AsyncStorage.getItem('monthly_budget');
    const savedNotifications = await AsyncStorage.getItem('notifications_enabled');
    const savedLanguage = await AsyncStorage.getItem('language');

    if (savedBudget) setBudget(savedBudget);
    if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
    if (savedLanguage) setCurrentLanguage(savedLanguage);
  };

  const handleSetBudget = async () => {
    if (budget && !isNaN(parseFloat(budget))) {
      await AsyncStorage.setItem('monthly_budget', budget);
      Alert.alert(t('budgetUpdated'));
    }
  };

  const handleRemoveBudget = async () => {
    await AsyncStorage.removeItem('monthly_budget');
    setBudget('');
    Alert.alert(t('budgetRemoved'));
  };

  const handleSetPin = async () => {
    if (pin.length === 4 && !isNaN(pin)) {
      await AsyncStorage.setItem('user_pin', pin);
      Alert.alert(t('pinSuccess'));
      setPin('');
    } else {
      Alert.alert(t('invalidPin'));
    }
  };

  const handleRemovePin = async () => {
    await AsyncStorage.removeItem('user_pin');
    Alert.alert(t('pinRemoved'));
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notifications_enabled', value.toString());
    Alert.alert(value ? t('notificationsEnabled') : t('notificationsDisabled'));
  };

  const changeLanguage = async (lang) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language', lang);
    setCurrentLanguage(lang);
  };

  const handleResetData = () => {
    Alert.alert(
      t('confirmReset'),
      t('confirmResetDescription'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('yes'),
          onPress: async () => {
            const email = await AsyncStorage.getItem('email');
            await AsyncStorage.clear();
            if (email) await AsyncStorage.setItem('email', email);
            Alert.alert(t('profileResetSuccess'));
            navigation.navigate('Welcome');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('setMonthlyBudget')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('enterAmount')}
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleSetBudget}>
              <Text style={styles.buttonText}>{t('save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleRemoveBudget}
            >
              <Text style={styles.buttonText}>{t('removeBudget')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('setUpdatePin')}</Text>
          <TextInput
            style={styles.input}
            placeholder="4-digit PIN"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleSetPin}>
              <Text style={styles.buttonText}>{t('save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleRemovePin}
            >
              <Text style={styles.buttonText}>{t('removePin')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.sectionTitle}>{t('enableNotifications')}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'en' && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage('en')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  currentLanguage === 'en' && styles.languageButtonTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'bn' && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage('bn')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  currentLanguage === 'bn' && styles.languageButtonTextActive,
                ]}
              >
                বাংলা
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleResetData}
        >
          <Text style={styles.buttonText}>{t('resetAllData')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#888',
  },
  buttonDanger: {
    backgroundColor: 'red',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  languageButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  languageButtonText: {
    fontSize: 16,
    color: '#000',
  },
  languageButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

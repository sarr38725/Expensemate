import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { DatabaseHelper } from '../utils/database';

export default function AddTransactionScreen({ navigation }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('Income');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    'Food',
    'Shopping',
    'Fuel',
    'Salary',
    'Subscription',
    'Grocery',
    'Personal',
    'Travel',
    'Medicine',
    'Entertainment',
    'Bills',
    'Education',
    'Investment',
    'Others',
  ];

  const getLocalizedCategories = () => {
    return categories.map((cat) => ({
      value: cat,
      label: t(`category_${cat.toLowerCase()}`),
    }));
  };

  const handleSave = async () => {
    if (!amount || !description) {
      Alert.alert(t('allFieldsRequired'));
      return;
    }

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        Alert.alert(t('invalidAmount'));
        return;
      }

      await DatabaseHelper.addTransaction(
        parsedAmount,
        category,
        type,
        date.toISOString(),
        description
      );

      Alert.alert(t('transactionSaved'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('invalidAmount'));
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addTransaction')}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>{t('howMuch')}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>৳</Text>
          <TextInput
            style={styles.amountInput}
            placeholder={t('enterAmount')}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>{t('category')}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            {getLocalizedCategories().map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t('description')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('description')}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>{t('date')}</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{format(date, 'MMMM d, yyyy')}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'Income' && styles.typeButtonActive,
              type === 'Income' && { backgroundColor: 'green' },
            ]}
            onPress={() => setType('Income')}
          >
            <Text
              style={[
                styles.typeText,
                type === 'Income' && styles.typeTextActive,
              ]}
            >
              {t('income')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'Expense' && styles.typeButtonActive,
              type === 'Expense' && { backgroundColor: 'red' },
            ]}
            onPress={() => setType('Expense')}
          >
            <Text
              style={[
                styles.typeText,
                type === 'Expense' && styles.typeTextActive,
              ]}
            >
              {t('expense')}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('continueButton')}</Text>
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
  },
  backButton: {
    fontSize: 30,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currency: {
    fontSize: 20,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  typeButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  typeButtonActive: {
    borderColor: 'transparent',
  },
  typeText: {
    color: '#000',
  },
  typeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

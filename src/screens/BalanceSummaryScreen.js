import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DatabaseHelper } from '../utils/database';

export default function BalanceSummaryScreen({ navigation }) {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await DatabaseHelper.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const formatAmount = (amount) => {
    return amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('balanceSummary')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('balance')}</Text>
          <Text
            style={[
              styles.balanceAmount,
              { color: balance >= 0 ? 'green' : 'red' },
            ]}
          >
            ৳{formatAmount(balance)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryItem, styles.incomeItem]}>
            <Icon name="arrow-downward" size={30} color="green" />
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryLabel}>{t('income')}</Text>
              <Text style={styles.incomeAmount}>
                ৳{formatAmount(totalIncome)}
              </Text>
            </View>
          </View>

          <View style={[styles.summaryItem, styles.expenseItem]}>
            <Icon name="arrow-upward" size={30} color="red" />
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryLabel}>{t('expenses')}</Text>
              <Text style={styles.expenseAmount}>
                ৳{formatAmount(totalExpense)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Summary Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Transactions:</Text>
            <Text style={styles.infoValue}>{transactions.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Income Transactions:</Text>
            <Text style={styles.infoValue}>
              {transactions.filter((t) => t.type === 'Income').length}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expense Transactions:</Text>
            <Text style={styles.infoValue}>
              {transactions.filter((t) => t.type === 'Expense').length}
            </Text>
          </View>
        </View>
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
  balanceCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  incomeItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  expenseItem: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  summaryDetails: {
    marginLeft: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  expenseAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

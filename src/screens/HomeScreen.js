import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DatabaseHelper } from '../utils/database';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    await loadTransactions();
    await loadBudget();
    await loadProfileImage();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadTransactions = async () => {
    try {
      const data = await DatabaseHelper.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadBudget = async () => {
    const budget = await AsyncStorage.getItem('monthly_budget');
    setMonthlyBudget(budget ? parseFloat(budget) : null);
  };

  const loadProfileImage = async () => {
    const image = await AsyncStorage.getItem('profile_image');
    setProfileImage(image);
  };

  const getFilteredTransactions = () => {
    const now = new Date();

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);

      switch (selectedFilter) {
        case 'today':
          return format(txDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
        case 'week':
          return isWithinInterval(txDate, {
            start: startOfWeek(now, { weekStartsOn: 1 }),
            end: endOfWeek(now, { weekStartsOn: 1 }),
          });
        case 'month':
          return isWithinInterval(txDate, {
            start: startOfMonth(now),
            end: endOfMonth(now),
          });
        case 'year':
          return isWithinInterval(txDate, {
            start: startOfYear(now),
            end: endOfYear(now),
          });
        default:
          return true;
      }
    });
  };

  const getFormattedDate = () => {
    const now = new Date();

    switch (selectedFilter) {
      case 'today':
        return format(now, 'd/M/yyyy');
      case 'week':
        return `${format(startOfWeek(now, { weekStartsOn: 1 }), 'd/M')} - ${format(endOfWeek(now, { weekStartsOn: 1 }), 'd/M')}`;
      case 'month':
        return format(now, 'MMMM yyyy');
      case 'year':
        return format(now, 'yyyy');
      default:
        return format(now, 'd/M/yyyy');
    }
  };

  const filteredTransactions = getFilteredTransactions();

  const incomeTotal = filteredTransactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const expenseTotal = filteredTransactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const formatAmount = (amount) => {
    return amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
  };

  const filters = [
    { key: 'today', label: t('today') },
    { key: 'week', label: t('week') },
    { key: 'month', label: t('month') },
    { key: 'year', label: t('year') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="calendar-today" size={20} color="#000" />
          <View style={styles.headerText}>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
            <Text style={styles.balanceText}>{t('accountBalance')}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../assets/images/user.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {monthlyBudget && (
          <View style={styles.budgetContainer}>
            <Text style={styles.budgetText}>
              {t('monthlyBudget')}: ৳{formatAmount(monthlyBudget)}
            </Text>
            {selectedFilter === 'month' && (
              <Text
                style={[
                  styles.remainingText,
                  {
                    color: expenseTotal > monthlyBudget ? 'red' : 'green',
                  },
                ]}
              >
                {t('remaining')}: ৳{formatAmount(monthlyBudget - expenseTotal)}
              </Text>
            )}
          </View>
        )}

        {monthlyBudget &&
          selectedFilter === 'month' &&
          expenseTotal > monthlyBudget && (
            <View style={styles.warningContainer}>
              <Icon name="warning" size={20} color="red" />
              <Text style={styles.warningText}>{t('budgetExceeded')}</Text>
            </View>
          )}

        <View style={styles.balanceCards}>
          <View style={[styles.balanceCard, styles.incomeCard]}>
            <View style={styles.cardHeader}>
              <Icon name="arrow-downward" size={20} color="green" />
              <Text style={styles.incomeLabel}>{t('income')}</Text>
            </View>
            <Text style={styles.incomeAmount}>৳{formatAmount(incomeTotal)}</Text>
          </View>

          <View style={[styles.balanceCard, styles.expenseCard]}>
            <View style={styles.cardHeader}>
              <Icon name="arrow-upward" size={20} color="red" />
              <Text style={styles.expenseLabel}>{t('expenses')}</Text>
            </View>
            <Text style={styles.expenseAmount}>
              ৳{formatAmount(expenseTotal)}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>{t('recentTransactions')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.viewAll}>{t('viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {filteredTransactions.length === 0 ? (
          <Text style={styles.noTransactions}>{t('noTransactions')}</Text>
        ) : (
          filteredTransactions.slice(0, 10).map((tx) => (
            <View
              key={tx.id}
              style={[
                styles.transactionItem,
                {
                  backgroundColor:
                    tx.type === 'Income'
                      ? 'rgba(76, 175, 80, 0.1)'
                      : 'rgba(244, 67, 54, 0.1)',
                },
              ]}
            >
              <Icon
                name={tx.type === 'Income' ? 'arrow-downward' : 'arrow-upward'}
                size={24}
                color={tx.type === 'Income' ? 'green' : 'red'}
              />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAmount}>
                  ৳{formatAmount(parseFloat(tx.amount))}
                </Text>
                <Text style={styles.transactionDescription}>
                  {tx.description}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionType,
                  { color: tx.type === 'Income' ? 'green' : 'red' },
                ]}
              >
                {tx.type}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerText: {
    marginLeft: 8,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceText: {
    fontSize: 13,
    color: '#888',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  budgetText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  remainingText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  warningText: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  balanceCards: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  balanceCard: {
    width: 160,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  incomeCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  expenseCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  incomeLabel: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  expenseLabel: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  incomeAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
  },
  expenseAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'red',
  },
  filterContainer: {
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#000',
  },
  filterText: {
    color: '#000',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  transactionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  viewAll: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noTransactions: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  transactionType: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

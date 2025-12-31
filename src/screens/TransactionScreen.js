import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DatabaseHelper } from '../utils/database';

export default function TransactionScreen() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const loadTransactions = async () => {
    try {
      const data = await DatabaseHelper.getAllTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (tx) =>
          tx.category.toLowerCase().includes(query.toLowerCase()) ||
          tx.description.toLowerCase().includes(query.toLowerCase()) ||
          tx.amount.toString().includes(query)
      );
      setFilteredTransactions(filtered);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await DatabaseHelper.deleteTransaction(id);
            loadTransactions();
          },
        },
      ]
    );
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = async () => {
    try {
      await DatabaseHelper.updateTransaction(editingTransaction);
      Alert.alert('Success', 'Transaction updated successfully');
      setEditingTransaction(null);
      loadTransactions();
    } catch (error) {
      Alert.alert('Error', t('updateFailed'));
    }
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
  };

  const renderTransaction = ({ item }) => (
    <View
      style={[
        styles.transactionItem,
        {
          backgroundColor:
            item.type === 'Income'
              ? 'rgba(76, 175, 80, 0.1)'
              : 'rgba(244, 67, 54, 0.1)',
        },
      ]}
    >
      <View style={styles.transactionLeft}>
        <Icon
          name={item.type === 'Income' ? 'arrow-downward' : 'arrow-upward'}
          size={24}
          color={item.type === 'Income' ? 'green' : 'red'}
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionAmount}>
            ৳{formatAmount(item.amount)}
          </Text>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {format(new Date(item.date), 'MMM d, yyyy')}
          </Text>
        </View>
      </View>
      <View style={styles.transactionActions}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Icon name="edit" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Icon name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (editingTransaction) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setEditingTransaction(null)}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('editTransaction')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.editForm}>
          <Text style={styles.label}>{t('amount')}</Text>
          <TextInput
            style={styles.input}
            value={editingTransaction.amount.toString()}
            onChangeText={(text) =>
              setEditingTransaction({ ...editingTransaction, amount: text })
            }
            keyboardType="numeric"
          />

          <Text style={styles.label}>{t('description')}</Text>
          <TextInput
            style={styles.input}
            value={editingTransaction.description}
            onChangeText={(text) =>
              setEditingTransaction({ ...editingTransaction, description: text })
            }
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('transactionHistory')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchHint')}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <Text style={styles.resultCount}>
        {t('showing')} {filteredTransactions.length} {t('transactionsAll')}
      </Text>

      {filteredTransactions.length === 0 ? (
        <Text style={styles.noTransactions}>{t('noTransactionsAvailable')}</Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  resultCount: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1,
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
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  noTransactions: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
  editForm: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DatabaseHelper = {
  async addTransaction(amount, category, type, date, description) {
    const email = await AsyncStorage.getItem('email');

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_email: email || 'guest@expensemate.com',
          amount: parseFloat(amount),
          category,
          type,
          date,
          description,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  },

  async getAllTransactions() {
    const email = await AsyncStorage.getItem('email');

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_email', email || 'guest@expensemate.com')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateTransaction(transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        amount: parseFloat(transaction.amount),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
        description: transaction.description,
      })
      .eq('id', transaction.id)
      .select();

    if (error) throw error;
    return data;
  },

  async deleteTransaction(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async resetAllTransactionsForUser() {
    const email = await AsyncStorage.getItem('email');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_email', email || 'guest@expensemate.com');

    if (error) throw error;
  },
};

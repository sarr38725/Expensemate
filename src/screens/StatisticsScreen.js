import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BarChart } from 'react-native-chart-kit';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { DatabaseHelper } from '../utils/database';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen({ navigation }) {
  const { t } = useTranslation();
  const [showIncome, setShowIncome] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const loadTransactions = async () => {
    try {
      const data = await DatabaseHelper.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const getWeeklyChartData = () => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const incomeData = Array(7).fill(0);
    const expenseData = Array(7).fill(0);

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      for (let i = 0; i < 7; i++) {
        const day = addDays(selectedWeekStart, i);
        if (isSameDay(txDate, day)) {
          const amount = parseFloat(tx.amount);
          if (tx.type === 'Income') {
            incomeData[i] += amount;
          } else if (tx.type === 'Expense') {
            expenseData[i] += amount;
          }
        }
      }
    });

    return {
      labels,
      datasets: [
        {
          data: expenseData.map((val) => (val === 0 ? 0.1 : val)),
          color: () => 'rgba(244, 67, 54, 1)',
        },
        {
          data: incomeData.map((val) => (val === 0 ? 0.1 : val)),
          color: () => 'rgba(76, 175, 80, 1)',
        },
      ],
    };
  };

  const getCategoryData = () => {
    const weekEnd = addDays(selectedWeekStart, 6);
    const categoryMap = {};

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      if (
        txDate >= selectedWeekStart &&
        txDate <= weekEnd &&
        tx.type === (showIncome ? 'Income' : 'Expense')
      ) {
        const category = tx.category;
        const amount = parseFloat(tx.amount);
        categoryMap[category] = (categoryMap[category] || 0) + amount;
      }
    });

    return categoryMap;
  };

  const categoryData = getCategoryData();
  const total = Object.values(categoryData).reduce((a, b) => a + b, 0);

  const weekRange = `${format(selectedWeekStart, 'MMM d')} - ${format(addDays(selectedWeekStart, 6), 'MMM d')}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('weeklyReport')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.weekSelector}>
          <Text style={styles.weekLabel}>{t('weekLabel')}:</Text>
          <TouchableOpacity style={styles.weekButton}>
            <Text style={styles.weekButtonText}>{weekRange}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartContainer}>
          <BarChart
            data={getWeeklyChartData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={styles.chart}
            withInnerLines={false}
            showBarTops={false}
            fromZero
          />
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !showIncome && styles.toggleButtonActive,
              !showIncome && { backgroundColor: 'red' },
            ]}
            onPress={() => setShowIncome(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !showIncome && styles.toggleTextActive,
              ]}
            >
              {t('expenseLabel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              showIncome && styles.toggleButtonActive,
              showIncome && { backgroundColor: 'green' },
            ]}
            onPress={() => setShowIncome(true)}
          >
            <Text
              style={[
                styles.toggleText,
                showIncome && styles.toggleTextActive,
              ]}
            >
              {t('incomeLabel')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.categoryTitle}>{t('category')}</Text>

        {Object.keys(categoryData).length === 0 ? (
          <Text style={styles.noData}>{t('noData')}</Text>
        ) : (
          Object.entries(categoryData).map(([category, amount]) => {
            const percent = total === 0 ? 0 : amount / total;
            const color = showIncome ? 'green' : 'red';
            const localizedCategory =
              t(`category_${category.toLowerCase()}`) || category;

            return (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View
                    style={[styles.categoryDot, { backgroundColor: color }]}
                  />
                  <Text style={styles.categoryName}>{localizedCategory}</Text>
                  <Text style={styles.categoryAmount}>
                    ৳{amount.toFixed(0)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${percent * 100}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
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
    padding: 16,
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  weekButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  weekButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  toggleButtonActive: {
    borderColor: 'transparent',
  },
  toggleText: {
    color: '#000',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontWeight: '500',
  },
  categoryAmount: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const loadExpenses = async () => {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
    };
    loadExpenses();
  }, []);

  const saveExpenses = async (updatedExpenses) => {
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const addExpense = () => {
    if (!expenseName || !expenseAmount) {
      Alert.alert('Validation', 'Please fill in both fields.');
      return;
    }

    const newExpense = {
      id: Math.random().toString(), 
      name: expenseName,
      amount: parseFloat(expenseAmount),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);

    saveExpenses(updatedExpenses);

   
    setExpenseName('');
    setExpenseAmount('');
  };

  const getTotalAmount = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text style={styles.expenseText}>{item.name}: {item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Expense Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter expense name"
          value={expenseName}
          onChangeText={setExpenseName}
        />

        <Text style={styles.label}>Expense Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={expenseAmount}
          onChangeText={setExpenseAmount}
        />

        <Button title="Add Expense" onPress={addExpense} />
      </View>

      <Text style={styles.total}>Total Expenses: {getTotalAmount().toFixed(2)}</Text>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  total: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  expenseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  expenseText: {
    fontSize: 18,
  },
});

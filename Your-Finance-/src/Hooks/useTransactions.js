import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/api';

/**
 * Normaliza a transação retornada pelo PostgreSQL/NestJS para a interface do frontend:
 * - Converte Decimal do Prisma para Number
 * - Formata a data para 'YYYY-MM-DD'
 * - Converte o enum 'RECEBIMENTO' | 'DESPESA' para 'Recebimento' | 'Despesa'
 */
const normalizeTransaction = (item) => {
  const isReceipt = item.type === 'RECEBIMENTO' || item.type === 'Recebimento';
  const rawDate = typeof item.date === 'string'
    ? item.date.split('T')[0]
    : new Date(item.date).toISOString().split('T')[0];

  return {
    ...item,
    type: isReceipt ? 'Recebimento' : 'Despesa',
    value: Number(item.value),
    date: rawDate,
  };
};

const useTransactions = () => {
  const [transactionsList, setTransactionsList] = useState([]);
  const [lastFour, setLastFour] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const rawData = await transactionService.getAll();
      const data = Array.isArray(rawData) ? rawData.map(normalizeTransaction) : [];

      setTransactionsList(data);

      const ordered = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setLastFour(ordered.slice(0, 4));

      setFilteredReceipts(data.filter((trs) => trs.type === 'Recebimento'));
      setFilteredExpenses(data.filter((trs) => trs.type === 'Despesa'));
    } catch (err) {
      console.error('Erro ao buscar transações no NestJS:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar transações.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (formData, idempotencyKey = null) => {
    const payload = {
      ...formData,
      type: formData.type === 'Recebimento' ? 'RECEBIMENTO' : 'DESPESA',
      value: Number(formData.value),
    };
    const headers = idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : {};
    const created = await transactionService.create(payload, headers);
    await fetchTransactions();
    return normalizeTransaction(created);
  };

  const updateTransaction = async (id, updatedData) => {
    const payload = {
      ...updatedData,
      ...(updatedData.type && {
        type: updatedData.type === 'Recebimento' ? 'RECEBIMENTO' : 'DESPESA',
      }),
      ...(updatedData.value !== undefined && {
        value: Number(updatedData.value),
      }),
    };
    const updated = await transactionService.update(id, payload);
    await fetchTransactions();
    return normalizeTransaction(updated);
  };

  const deleteTransaction = async (id) => {
    await transactionService.delete(id);
    setTransactionsList((prev) => prev.filter((trs) => trs.id !== id));
    setLastFour((prev) => prev.filter((trs) => trs.id !== id));
    setFilteredReceipts((prev) => prev.filter((trs) => trs.id !== id));
    setFilteredExpenses((prev) => prev.filter((trs) => trs.id !== id));
  };

  return {
    transactionsList,
    lastFour,
    filteredReceipts,
    filteredExpenses,
    error,
    loading,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export default useTransactions;
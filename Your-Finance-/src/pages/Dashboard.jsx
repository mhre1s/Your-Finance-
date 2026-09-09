import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import Header from "../Components/Header";
import TransactionCard from "../Components/TransactionCard";
import TransactionRedCard from "../Components/TransactionRedCard";
import TransactionNeutralCard from "../Components/TransactionNeutralCard";
import useTransactions from "../Hooks/useTransactions";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  Receipt,
  Calendar,
  RotateCcw,
  Clock,
} from "lucide-react";

/**
 * Utilitário para formatar datas para o formato ISO (YYYY-MM-DD)
 * considerando o fuso horário local do usuário.
 */
const formatDateToISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Retorna o range padrão de 1 mês (últimos 30 dias até hoje)
 */
const getDefaultThirtyDaysRange = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  return {
    start: formatDateToISO(thirtyDaysAgo),
    end: formatDateToISO(now),
  };
};

/**
 * Retorna o range do mês civil atual (do dia 1º ao último dia do mês corrente)
 */
const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: formatDateToISO(firstDay),
    end: formatDateToISO(lastDay),
  };
};

const Dashboard = () => {
  const { transactionsList, loading } = useTransactions();

  // Range padrão inicial: 1 mês (últimos 30 dias)
  const initialRange = useMemo(() => getDefaultThirtyDaysRange(), []);
  const [filterPreset, setFilterPreset] = useState("30d"); // '30d' | 'month' | 'all' | 'custom'
  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);

  // Aplicação do preset de filtro
  const handleSelectPreset = (preset) => {
    setFilterPreset(preset);

    if (preset === "30d") {
      const range = getDefaultThirtyDaysRange();
      setStartDate(range.start);
      setEndDate(range.end);
    } else if (preset === "month") {
      const range = getCurrentMonthRange();
      setStartDate(range.start);
      setEndDate(range.end);
    } else if (preset === "all") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleCustomStartDate = (value) => {
    setStartDate(value);
    setFilterPreset("custom");
  };

  const handleCustomEndDate = (value) => {
    setEndDate(value);
    setFilterPreset("custom");
  };

  /**
   * Filtra as transações pela DATA DE COMPETÊNCIA (transaction.date),
   * e não pela data de criação do registro.
   */
  const filteredTransactions = useMemo(() => {
    return transactionsList.filter((trs) => {
      if (filterPreset === "all" || (!startDate && !endDate)) {
        return true;
      }
      if (startDate && trs.date < startDate) return false;
      if (endDate && trs.date > endDate) return false;
      return true;
    });
  }, [transactionsList, filterPreset, startDate, endDate]);

  // Separação de Receitas e Despesas do período filtrado
  const periodReceipts = useMemo(() => {
    return filteredTransactions.filter(
      (trs) =>
        trs.type === "receita" ||
        trs.type === "entrada" ||
        trs.type === "Recebimento" ||
        trs.type === "RECEBIMENTO"
    );
  }, [filteredTransactions]);

  const periodExpenses = useMemo(() => {
    return filteredTransactions.filter(
      (trs) =>
        trs.type === "despesa" ||
        trs.type === "saida" ||
        trs.type === "Despesa" ||
        trs.type === "DESPESA"
    );
  }, [filteredTransactions]);

  // Cálculos dinâmicos correspondentes ao range selecionado
  const reducedReceipts = useMemo(() => {
    return periodReceipts.reduce((acc, val) => acc + Number(val.value), 0);
  }, [periodReceipts]);

  const reducedExpenses = useMemo(() => {
    return periodExpenses.reduce((acc, val) => acc + Number(val.value), 0);
  }, [periodExpenses]);

  const amount = reducedReceipts - reducedExpenses;

  // Transações mais recentes do período selecionado (ordenadas pela data de competência)
  const recentInPeriod = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [filteredTransactions]);

  // Texto legível do range selecionado
  const rangeDescription = useMemo(() => {
    if (filterPreset === "all" || (!startDate && !endDate)) {
      return "Todo o histórico disponível";
    }
    const formattedStart = startDate
      ? startDate.split("-").reverse().join("/")
      : "Início";
    const formattedEnd = endDate
      ? endDate.split("-").reverse().join("/")
      : "Atual";
    return `${formattedStart} até ${formattedEnd}`;
  }, [filterPreset, startDate, endDate]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Visão Geral
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Acompanhe seu fluxo de caixa consolidado por data de competência.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/newtransaction"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>Adicionar transação</span>
            </Link>
          </div>
        </div>

        {/* Barra de Filtro de Período / Range de Tempo */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Presets Rápidos */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mr-1 flex items-center gap-1.5">
                <Calendar size={15} />
                <span>Período:</span>
              </span>

              <div className="inline-flex bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                <button
                  type="button"
                  onClick={() => handleSelectPreset("30d")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filterPreset === "30d"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Últimos 30 dias (Padrão)
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset("month")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filterPreset === "month"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Mês atual
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filterPreset === "all"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Todo o tempo
                </button>
              </div>
            </div>

            {/* Inputs de Data Personalizada */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-500 dark:text-zinc-400">De:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleCustomStartDate(e.target.value)}
                  className="px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  aria-label="Data inicial"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-500 dark:text-zinc-400">Até:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleCustomEndDate(e.target.value)}
                  className="px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  aria-label="Data final"
                />
              </div>

              {filterPreset !== "30d" && (
                <button
                  type="button"
                  onClick={() => handleSelectPreset("30d")}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  title="Restaurar para o padrão de 1 mês"
                  aria-label="Restaurar padrão"
                >
                  <RotateCcw size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Badge Informativo do Período Ativo */}
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>Competência ativa: <strong className="text-zinc-700 dark:text-zinc-300 font-medium">{rangeDescription}</strong></span>
            </span>
            <span>
              <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{filteredTransactions.length}</strong> {filteredTransactions.length === 1 ? "lançamento" : "lançamentos"}
            </span>
          </div>
        </div>

        {/* Grid de Métricas Financeiras (Vinculadas ao Range) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 w-full bg-zinc-200/60 dark:bg-zinc-900/60 animate-pulse rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50"
              />
            ))
          ) : (
            <>
              <TransactionCard receipts={reducedReceipts} />
              <TransactionRedCard expenses={reducedExpenses} />
              <TransactionNeutralCard amount={amount} />
            </>
          )}
        </section>

        {/* Tabela de Transações do Período */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Movimentações no período
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                Competência
              </span>
            </div>

            <Link
              to="/transactions"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <span>Ver histórico completo</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <th className="px-5 sm:px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Tipo
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Título / Categoria
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Data de Competência
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 text-right">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                {loading ? (
                  [1, 2, 3, 4].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-4">
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-full" />
                      </td>
                    </tr>
                  ))
                ) : recentInPeriod.length > 0 ? (
                  recentInPeriod.map((transaction) => {
                    const isReceipt =
                      transaction.type === "receita" ||
                      transaction.type === "entrada" ||
                      transaction.type === "Recebimento" ||
                      transaction.type === "RECEBIMENTO";

                    const formattedDate = transaction.date
                      ? transaction.date.split("-").reverse().join("/")
                      : "-";

                    return (
                      <tr
                        key={transaction.id}
                        className="hover:bg-zinc-50/75 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                              isReceipt
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            }`}
                          >
                            {isReceipt ? (
                              <ArrowUpRight size={13} strokeWidth={2.5} />
                            ) : (
                              <ArrowDownRight size={13} strokeWidth={2.5} />
                            )}
                            {isReceipt ? "Receita" : "Despesa"}
                          </span>
                        </td>

                        <td className="px-5 sm:px-6 py-3.5 font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {transaction.title === "Outros"
                            ? transaction.expenseName || "Outros"
                            : transaction.title}
                        </td>

                        <td className="px-5 sm:px-6 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td
                          className={`px-5 sm:px-6 py-3.5 text-right font-medium tabular-nums whitespace-nowrap ${
                            isReceipt
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isReceipt ? "+ " : "- "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(transaction.value)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
                          <Receipt size={20} />
                        </div>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Nenhuma movimentação registrada no período selecionado.
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <button
                            type="button"
                            onClick={() => handleSelectPreset("all")}
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                          >
                            Ver todo o tempo
                          </button>
                          <span className="text-zinc-300 dark:text-zinc-700">·</span>
                          <Link
                            to="/newtransaction"
                            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:underline"
                          >
                            Cadastrar transação
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

import React from "react";
import Header from "../Components/Header";
import TransactionCard from "../Components/TransactionCard";
import TransactionRedCard from "../Components/TransactionRedCard";
import TransactionNeutralCard from "../Components/TransactionNeutralCard";
import useTransactions from "../Hooks/useTransactions";

const Dashboard = () => {
  const { lastFour, error, filteredReceipts, filteredExpenses, loading } =
    useTransactions();

  const reducedReceipts = filteredReceipts.reduce(
    (acc, val) => acc + Number(val.value),
    0
  );
  const reducedExpenses = filteredExpenses.reduce(
    (acc, val) => acc + Number(val.value),
    0
  );
  const amount = reducedReceipts - reducedExpenses;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Seção de Resumo (Cards) */}
        {/* Seção de Resumo (Cards) - Centralização Corrigida */}
        <section className="flex flex-col md:flex-row flex-wrap justify-center min-[850px]:justify-between items-center gap-6 mb-12">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 w-full max-w-[320px] bg-slate-200 dark:bg-gray-800 animate-pulse rounded-2xl"
              />
            ))
          ) : (
            <>
              {/* Ordem ajustada para: Receitas | Saldo (Centro) | Despesas */}
              <div className="order-1">
                <TransactionCard receipts={reducedReceipts} />
              </div>

              <div className="order-3">
                {/* Card de Saldo levemente maior e sempre no centro */}
                <TransactionNeutralCard amount={amount} />
              </div>

              <div className="order-2">
                <TransactionRedCard expenses={reducedExpenses} />
              </div>
            </>
          )}
        </section>
        {/* Tabela de Transações */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h4 className="text-xl font-semibold">Últimas transações</h4>
            <span className="text-xs font-medium bg-slate-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase tracking-wider opacity-70">
              Recentes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Tipo</th>
                  <th className="px-6 py-4 font-medium">Título</th>
                  <th className="px-6 py-4 font-medium text-right">Valor</th>
                  <th className="px-6 py-4 font-medium text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {loading
                  ? [1, 2, 3, 4].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="4" className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-full" />
                        </td>
                      </tr>
                    ))
                  : lastFour.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {/* ... dentro do map das transações ... */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded capitalize ${
                              transaction.type === "receita" ||
                              transaction.type === "entrada" ||
                              transaction.type === "Recebimento" // Adicionado aqui
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-medium">
                          {transaction.title === "Outros"
                            ? transaction.expenseName
                            : transaction.title}
                        </td>

                        <td
                          className={`px-6 py-4 text-right font-semibold ${
                            transaction.type === "receita" ||
                            transaction.type === "entrada" ||
                            transaction.type === "Recebimento" // Adicionado aqui também
                              ? "text-emerald-500"
                              : "text-rose-500"
                          }`}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(transaction.value)}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 text-sm">
                          {new Date(transaction.date).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && lastFour.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              Nenhuma transação encontrada.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

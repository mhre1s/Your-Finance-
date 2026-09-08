import React from "react";
import { Link } from "react-router";
import Header from "../Components/Header";
import TransactionCard from "../Components/TransactionCard";
import TransactionRedCard from "../Components/TransactionRedCard";
import TransactionNeutralCard from "../Components/TransactionNeutralCard";
import useTransactions from "../Hooks/useTransactions";
import { ArrowUpRight, ArrowDownRight, ArrowRight, Plus, Receipt } from "lucide-react";

const Dashboard = () => {
  const { lastFour, filteredReceipts, filteredExpenses, loading } =
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Visão Geral
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Acompanhe seu fluxo de caixa consolidado em tempo real.
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

        {/* Grid de Métricas Financeiras */}
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

        {/* Tabela de Transações Recentes */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Últimas movimentações
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                Recentes
              </span>
            </div>

            <Link
              to="/transactions"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <span>Ver todas</span>
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
                    Data
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
                ) : lastFour.length > 0 ? (
                  lastFour.map((transaction) => {
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
                              : "text-zinc-900 dark:text-zinc-100"
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
                          Nenhuma movimentação registrada ainda.
                        </p>
                        <Link
                          to="/newtransaction"
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-1"
                        >
                          Cadastrar primeira transação &rarr;
                        </Link>
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

import React from "react";
import { ArrowDownRight } from "lucide-react";

const TransactionRedCard = ({ expenses = 0 }) => {
  const formattedExpenses = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(expenses);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-xs transition-all hover:border-rose-500/30">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Despesas no período
        </span>
        <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <ArrowDownRight size={18} strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
          {formattedExpenses}
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1.5 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Saídas registradas
        </p>
      </div>
    </div>
  );
};

export default TransactionRedCard;

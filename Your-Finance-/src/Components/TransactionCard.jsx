import React from "react";
import { ArrowUpRight } from "lucide-react";

const TransactionCard = ({ receipts = 0 }) => {
  const formattedReceipts = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(receipts);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-xs transition-all hover:border-emerald-500/30">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Receitas no período
        </span>
        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <ArrowUpRight size={18} strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
          {formattedReceipts}
        </h3>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Entradas registradas
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;

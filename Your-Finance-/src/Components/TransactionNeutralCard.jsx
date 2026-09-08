import React from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

const TransactionNeutralCard = ({ amount = 0 }) => {
  const isPositive = amount >= 0;

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-xs transition-all hover:border-zinc-400/40 dark:hover:border-zinc-700/60">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Saldo disponível
        </span>
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isPositive
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
          }`}
        >
          <Wallet size={18} strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-4">
        <h3
          className={`text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums ${
            isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {formattedAmount}
        </h3>
        <p
          className={`text-xs font-medium mt-1.5 flex items-center gap-1 ${
            isPositive
              ? "text-emerald-600/80 dark:text-emerald-400/80"
              : "text-rose-600/80 dark:text-rose-400/80"
          }`}
        >
          {isPositive ? (
            <>
              <TrendingUp size={14} />
              Saldo líquido positivo
            </>
          ) : (
            <>
              <TrendingDown size={14} />
              Saldo líquido negativo
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default TransactionNeutralCard;

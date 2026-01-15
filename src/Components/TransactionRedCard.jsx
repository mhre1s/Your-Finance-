import React from "react";
import { ArrowDown, TrendingDown } from "lucide-react";

const TransactionRedCard = ({ expenses }) => {
  const formattedExpenses = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(expenses);

  return (
    <div className="relative group transition-all duration-300 hover:-translate-y-1">
      {/* Glow effect de fundo em tons de vermelho/rose */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>

      <div className="relative bg-white dark:bg-gray-900 border border-slate-200 dark:border-rose-500/20 rounded-2xl p-6 shadow-sm w-72 h-40 flex flex-col justify-between overflow-hidden">
        {/* Detalhe decorativo sutil no fundo */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 dark:bg-rose-500/10 rounded-lg">
              <ArrowDown
                className="text-rose-600 dark:text-rose-400"
                size={20}
                strokeWidth={2.5}
              />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Despesas
            </span>
          </div>
          {/* Ícone de tendência sutil */}
          <TrendingDown
            size={16}
            className="text-rose-300 dark:text-rose-900"
          />
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formattedExpenses}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full uppercase">
              Saída Total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionRedCard;

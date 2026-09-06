import React from "react";
import { ArrowUp } from "lucide-react";

const TransactionCard = ({ receipts }) => {
  const formattedReceipts = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(receipts);

  return (
    <div className="w-64 relative group transition-all duration-300 hover:-translate-y-1">
      {/* Glow effect de fundo (aparece mais no dark mode) */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>

      <div className="relative bg-white dark:bg-gray-900 border border-slate-200 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm w-64 h-40 flex flex-col justify-between overflow-hidden">
        {/* Detalhe decorativo sutil no fundo */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg">
              <ArrowUp
                className="text-emerald-600 dark:text-emerald-400"
                size={20}
                strokeWidth={2.5}
              />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recebimentos
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formattedReceipts}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
              Entrada Total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;

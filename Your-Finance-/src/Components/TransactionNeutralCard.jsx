import React from "react";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";

const TransactionNeutralCard = ({ amount }) => {
  const isPositive = amount >= 0;

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return (
    <div className="relative group transition-all duration-300 hover:-translate-y-1">
      {/* Glow dinâmico: Muda de cor baseado no saldo */}
      <div
        className={`absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300 ${
          isPositive ? "bg-emerald-500" : "bg-rose-500"
        }`}
      ></div>

      <div className="relative bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl w-64 h-40 flex flex-col justify-between overflow-hidden">
        {/* Ícone de fundo sutil para dar textura */}
        <Wallet
          className={`absolute -right-4 -bottom-4 opacity-5 dark:opacity-10 rotate-12 ${
            isPositive ? "text-emerald-500" : "text-rose-500"
          }`}
          size={120}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isPositive
                  ? "bg-emerald-100 dark:bg-emerald-500/10"
                  : "bg-rose-100 dark:bg-rose-500/10"
              }`}
            >
              {isPositive ? (
                <ArrowUp
                  className="text-emerald-600 dark:text-emerald-400"
                  size={20}
                  strokeWidth={2.5}
                />
              ) : (
                <ArrowDown
                  className="text-rose-600 dark:text-rose-400"
                  size={20}
                  strokeWidth={2.5}
                />
              )}
            </div>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Balanço Mensal
            </span>
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <h3
            className={`text-3xl font-black tracking-tight ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formattedAmount}
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            {isPositive ? "SEU SALDO ESTÁ POSITIVO" : "ATENÇÃO AOS GASTOS"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionNeutralCard;

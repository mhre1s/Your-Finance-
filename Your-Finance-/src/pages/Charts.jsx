import React, { useState } from "react";
import Header from "../Components/Header";
import BarChartComp from "../Components/BarChartComp";
import BarChartYearly from "../Components/BarChartYearly";
import PieCharts from "../Components/PieCharts";
import {
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  RotateCcw,
} from "lucide-react";

const Charts = () => {
  const [currentChart, setCurrentChart] = useState("mensal");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Relatórios e Análise
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Acompanhe a distribuição de despesas e a evolução temporal das finanças.
            </p>
          </div>

          {/* Seletor Mensal / Anual (Segmented Pill) */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 w-fit">
            <button
              onClick={() => setCurrentChart("mensal")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                currentChart === "mensal"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Visão Mensal
            </button>
            <button
              onClick={() => setCurrentChart("anual")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                currentChart === "anual"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Visão Anual
            </button>
          </div>
        </header>

        {/* Filtro de Intervalo de Datas */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 shadow-xs mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <Calendar size={15} />
                <span>Período personalizado:</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  aria-label="Data inicial"
                />
                <span className="text-xs text-zinc-400">até</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  aria-label="Data final"
                />
              </div>
            </div>

            {(startDate || endDate) && (
              <button
                onClick={clearDateFilter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Restaurar período</span>
              </button>
            )}
          </div>
        </div>

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico Principal de Barras (Fluxo) */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BarChart3 size={17} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Fluxo Comparativo ({currentChart === "mensal" ? "Mensal" : "Anual"})
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Receitas versus Despesas
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[340px] w-full pt-2">
              {currentChart === "mensal" ? (
                <BarChartComp startDate={startDate} endDate={endDate} />
              ) : (
                <BarChartYearly startDate={startDate} endDate={endDate} />
              )}
            </div>
          </div>

          {/* Gráfico de Pizza (Distribuição por Categoria) */}
          <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <PieChartIcon size={17} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Categorias de Despesa
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Distribuição proporcional de saídas
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[340px] w-full">
              <PieCharts startDate={startDate} endDate={endDate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Charts;

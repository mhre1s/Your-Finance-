import React, { useState } from "react";
import Header from "../Components/Header";
import BarChartComp from "../Components/BarChartComp";
import BarChartYearly from "../Components/BarChartYearly";
import PieCharts from "../Components/PieCharts";
import {
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
} from "lucide-react";

const Charts = () => {
  const [currentChart, setCurrentChart] = useState("mensal");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Título e Seletor Principal */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic">
              Análise de <span className="text-sky-500 not-italic">Dados.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Visualize seu desempenho financeiro visualmente.
            </p>
          </div>

          {/* Toggle Mensal/Anual Estilizado */}
          <div className="flex bg-slate-200/50 dark:bg-gray-900 p-1.5 rounded-2xl border border-slate-200 dark:border-gray-800 w-fit">
            <button
              onClick={() => setCurrentChart("mensal")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                currentChart === "mensal"
                  ? "bg-white dark:bg-gray-800 shadow-lg text-sky-600 dark:text-sky-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setCurrentChart("anual")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                currentChart === "anual"
                  ? "bg-white dark:bg-gray-800 shadow-lg text-sky-600 dark:text-sky-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Anual
            </button>
          </div>
        </header>

        {/* Filtros de Data Premium */}
        <div className="flex flex-wrap items-center gap-4 mb-10 p-4 bg-white dark:bg-gray-900/50 rounded-[2rem] border border-slate-200 dark:border-gray-800 w-fit mx-auto md:mx-0">
          <div className="flex items-center gap-3 px-4">
            <Calendar size={18} className="text-sky-500" />
            <label htmlFor="start">Início:</label>
            <input
              id="start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium dark:text-white"
            />
          </div>
          <ArrowRight size={16} className="hidden lg:block text-slate-300" />
          <div className="flex items-center gap-3 px-4">
            <Calendar size={18} className="text-sky-500" />
            <label htmlFor="end">Fim:</label>
            <input
              id="end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium dark:text-white"
            />
          </div>
        </div>

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico Principal (Barras) - Ocupa 2 colunas */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-gray-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-sky-100 dark:bg-sky-500/10 rounded-lg text-sky-600">
                <BarChart3 size={20} />
              </div>
              <h3 className="font-bold tracking-tight">
                Fluxo de Caixa ({currentChart})
              </h3>
            </div>

            <div className="h-[350px] w-full flex items-center justify-center overflow-hidden">
              {currentChart === "mensal" ? (
                <BarChartComp startDate={startDate} endDate={endDate} />
              ) : (
                <BarChartYearly startDate={startDate} endDate={endDate} />
              )}
            </div>
          </div>

          {/* Gráfico de Pizza - Ocupa 1 coluna */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-gray-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center">
            <div className="flex items-center gap-3 mb-8 w-full text-left">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg text-emerald-600">
                <PieChartIcon size={20} />
              </div>
              <h3 className="font-bold tracking-tight">Distribuição</h3>
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Principais Despesas (R$)
            </p>

            <div className="h-[300px] w-full flex items-center justify-center">
              <PieCharts startDate={startDate} endDate={endDate} />
            </div>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl w-full text-center">
              <span className="text-xs text-slate-500">
                Dados baseados no período selecionado
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Charts;

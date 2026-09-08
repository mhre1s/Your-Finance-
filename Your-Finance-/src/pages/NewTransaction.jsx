import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import Header from "../Components/Header";
import useTransactions from "../Hooks/useTransactions";
import { useToast } from "../context/ToastContext";
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
  ArrowLeft,
  Check,
} from "lucide-react";

const NewTransaction = () => {
  const { createTransaction } = useTransactions();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "Recebimento",
    title: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
    expenseName: "",
  });

  const formatValue = (value) => {
    return Number(String(value).replace(",", "."));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title && formData.type === "Recebimento") {
      toast.error("Campo obrigatório", "Informe a descrição da receita.");
      return;
    }

    if (!formData.title && formData.type === "Despesa") {
      toast.error("Campo obrigatório", "Selecione a categoria da despesa.");
      return;
    }

    const numValue = formatValue(formData.value);
    if (isNaN(numValue) || numValue <= 0) {
      toast.error("Valor inválido", "Informe um valor numérico maior que zero.");
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        ...formData,
        value: numValue,
      });

      // Disparo do Toast elegante exigido pelo usuário
      toast.success(
        "Transação registrada",
        `${formData.type === "Recebimento" ? "Receita" : "Despesa"} de R$ ${numValue.toFixed(2)} cadastrada com sucesso.`
      );

      navigate("/transactions");
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      toast.error(
        "Erro ao salvar",
        error instanceof Error ? error.message : "Não foi possível registrar a transação."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isReceipt = formData.type === "Recebimento";

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen flex flex-col text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />

      <main className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-xs">
          {/* Topo do Formulário */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Nova Transação
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Preencha os detalhes para registrar no seu fluxo financeiro.
              </p>
            </div>

            <Link
              to="/transactions"
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Voltar para histórico"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Seletor de Tipo (Segmented Control Elegante) */}
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                Tipo de movimentação
              </label>
              <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800/70 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      type: "Recebimento",
                      title: "",
                      expenseName: "",
                    }))
                  }
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isReceipt
                      ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <ArrowUpRight size={16} strokeWidth={2.2} />
                  <span>Receita / Entrada</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      type: "Despesa",
                      title: "",
                      expenseName: "",
                    }))
                  }
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    !isReceipt
                      ? "bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <ArrowDownRight size={16} strokeWidth={2.2} />
                  <span>Despesa / Saída</span>
                </button>
              </div>
            </div>

            {/* Descrição / Categoria */}
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                {isReceipt ? "Descrição da receita" : "Categoria da despesa"}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
                  <Tag size={16} />
                </div>
                {isReceipt ? (
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Ex: Salário, Projeto Freelance, Rendimentos..."
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                ) : (
                  <select
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="">Selecione uma categoria...</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Contas residenciais">Contas residenciais (Água, Luz, Internet)</option>
                    <option value="Condução">Transporte / Condução</option>
                    <option value="Saúde">Saúde & Farmácia</option>
                    <option value="Educação">Educação</option>
                    <option value="Lazer">Lazer & Assinaturas</option>
                    <option value="Outros">Outros</option>
                  </select>
                )}
              </div>
            </div>

            {/* Campo dinâmico quando despesa for "Outros" */}
            {!isReceipt && formData.title === "Outros" && (
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Especifique a despesa
                </label>
                <input
                  type="text"
                  name="expenseName"
                  required
                  placeholder="Ex: Reparo automotivo, Compra de equipamento..."
                  value={formData.expenseName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            )}

            {/* Grid Valor e Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Valor (R$)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-semibold text-zinc-400 pointer-events-none">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="value"
                    required
                    placeholder="0,00"
                    value={formData.value}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Data de competência
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={17} strokeWidth={2.4} />
                    <span>Salvar transação</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewTransaction;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import Header from "../Components/Header";
import CurrencyInput from "../Components/CurrencyInput";
import useTransactions from "../Hooks/useTransactions";
import { categoryService } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
  ArrowLeft,
  Check,
  Plus,
  X,
} from "lucide-react";

const NewTransaction = () => {
  const { createTransaction } = useTransactions();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Modal para criar categoria customizada exclusiva do usuário
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("#8b5cf6");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [formData, setFormData] = useState({
    type: "Recebimento",
    title: "",
    value: 0,
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const isReceipt = formData.type === "Recebimento";
  const currentTypeEnum = isReceipt ? "RECEBIMENTO" : "DESPESA";

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((c) => c.type === currentTypeEnum);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Nome obrigatório", "Digite um nome para a nova categoria.");
      return;
    }

    try {
      setCreatingCategory(true);
      const created = await categoryService.create({
        name: newCatName.trim(),
        type: currentTypeEnum,
        color: newCatColor,
      });

      toast.success("Categoria criada", `A categoria "${created.name}" foi adicionada com sucesso.`);
      setCategories((prev) => [...prev, created]);
      setFormData((prev) => ({ ...prev, categoryId: created.id }));
      setShowCategoryModal(false);
      setNewCatName("");
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
      toast.error(
        "Erro ao criar categoria",
        err instanceof Error ? err.message : "Não foi possível criar a categoria."
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Campo obrigatório", "Informe a descrição da movimentação.");
      return;
    }

    if (!formData.value || formData.value <= 0) {
      toast.error("Valor inválido", "Informe um valor maior que R$ 0,00.");
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        type: formData.type,
        title: formData.title.trim(),
        value: formData.value,
        date: formData.date,
        categoryId: formData.categoryId || undefined,
      });

      toast.success(
        "Transação registrada",
        `${isReceipt ? "Receita" : "Despesa"} de ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(formData.value)} cadastrada com sucesso.`
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

  const PRESET_COLORS = [
    "#f43f5e",
    "#f97316",
    "#eab308",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#71717a",
  ];

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
            {/* Seletor de Tipo (Segmented Control) */}
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
                      categoryId: "",
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
                      categoryId: "",
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

            {/* Descrição Limpa */}
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                Descrição da movimentação
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder={
                  isReceipt
                    ? "Ex: Salário da empresa, Rendimento de ações, Freelance..."
                    : "Ex: Supermercado Semaninha, Gasolina, Almoço no restaurante..."
                }
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Categoria com botão para criar nova categoria exclusiva */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Categoria
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Nova Categoria</span>
                </button>
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
                  <Tag size={16} />
                </div>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="">Selecione uma categoria...</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {!cat.isDefault ? "(Personalizada)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid Valor com Máscara BRL e Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Valor (R$)
                </label>
                <div className="relative flex items-center">
                  <CurrencyInput
                    value={formData.value}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, value: val.numericValue }))
                    }
                    placeholder="R$ 0,00"
                    required
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
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

      {/* Modal: Criar Categoria Personalizada Exclusiva do Usuário */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => !creatingCategory && setShowCategoryModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Nova Categoria ({isReceipt ? "Receita" : "Despesa"})
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Nome da categoria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jogos de video game, Pet Shop..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  🔒 Categoria privada: visível apenas para você.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Cor da categoria
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCatColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                        newCatColor === color
                          ? "border-zinc-900 dark:border-white scale-110 shadow-xs"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingCategory}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  {creatingCategory ? "Salvando..." : "Salvar Categoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTransaction;
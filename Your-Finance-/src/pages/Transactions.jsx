import React, { useState } from "react";
import { Link } from "react-router";
import useTransactions from "../Hooks/useTransactions";
import Header from "../Components/Header";
import { useToast } from "../context/ToastContext";
import {
  Pencil,
  Trash2,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Receipt,
  AlertTriangle,
} from "lucide-react";

const Transactions = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    transactionsList,
    deleteTransaction,
    updateTransaction,
    fetchTransactions,
    loading,
  } = useTransactions();

  const { toast } = useToast();

  const [editTitle, setEditTitle] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editType, setEditType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const transactionsPerPage = 10;

  const filteredTransactions = transactionsList.filter((transaction) => {
    const titleToMatch = (transaction.title || "").toLowerCase();
    const expenseToMatch = (transaction.expenseName || "").toLowerCase();
    const query = search.toLowerCase();

    const matchesTitle = titleToMatch.includes(query) || expenseToMatch.includes(query);
    const matchesType = filterType ? transaction.type === filterType : true;
    const matchesDate = filterDate ? transaction.date === filterDate : true;
    return matchesTitle && matchesDate && matchesType;
  });

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handleOpenUpdate = (t) => {
    setSelectedTransaction(t);
    setEditTitle(t.title);
    setEditValue(t.value);
    setEditDate(t.date);
    setEditType(t.type);
    setUpdateModal(true);
  };

  const confirmUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    const numValue = Number(String(editValue).replace(",", "."));
    if (isNaN(numValue) || numValue <= 0) {
      toast.error("Valor inválido", "Informe um valor numérico válido.");
      return;
    }

    try {
      setActionLoading(true);
      await updateTransaction(selectedTransaction.id, {
        title: editTitle,
        value: numValue,
        date: editDate,
        type: editType,
      });
      await fetchTransactions();
      toast.success("Transação atualizada", "Os dados foram salvos com sucesso.");
      setUpdateModal(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error(err);
      toast.error(
        "Erro ao atualizar",
        err instanceof Error ? err.message : "Não foi possível atualizar a transação."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDelete = (t) => {
    setSelectedTransaction(t);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTransaction) return;

    try {
      setActionLoading(true);
      await deleteTransaction(selectedTransaction.id);
      toast.success(
        "Transação excluída",
        `O registro "${selectedTransaction.title}" foi removido.`
      );
      setDeleteModal(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error(err);
      toast.error(
        "Erro ao excluir",
        err instanceof Error ? err.message : "Não foi possível excluir a transação."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const hasActiveFilters = search !== "" || filterDate !== "" || filterType !== "";

  const clearFilters = () => {
    setSearch("");
    setFilterDate("");
    setFilterType("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Histórico Financeiro
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Visualize, filtre e gerencie todas as suas movimentações financeiras.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/newtransaction"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>Nova transação</span>
            </Link>
          </div>
        </header>

        {/* Barra de Filtros e Busca */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por descrição ou categoria..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  showFilterMenu || filterType || filterDate
                    ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Filter size={15} />
                <span>Filtros</span>
                {(filterType || filterDate) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Gaveta de Filtros Expansível */}
          {showFilterMenu && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Filtrar por data específica
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Filtrar por tipo
                </label>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Recebimento">Apenas Receitas</option>
                  <option value="Despesa">Apenas Despesas</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tabela de Transações */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <th className="px-5 sm:px-6 py-3.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Tipo
                  </th>
                  <th className="px-5 sm:px-6 py-3.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Descrição / Categoria
                  </th>
                  <th className="px-5 sm:px-6 py-3.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Data
                  </th>
                  <th className="px-5 sm:px-6 py-3.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 text-right">
                    Valor
                  </th>
                  <th className="px-5 sm:px-6 py-3.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 text-center">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((t) => {
                    const isReceipt =
                      t.type === "receita" ||
                      t.type === "entrada" ||
                      t.type === "Recebimento" ||
                      t.type === "RECEBIMENTO";

                    const formattedDate = t.date
                      ? t.date.split("-").reverse().join("/")
                      : "-";

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-zinc-50/75 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                              isReceipt
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            }`}
                          >
                            {isReceipt ? (
                              <ArrowUpRight size={13} strokeWidth={2.5} />
                            ) : (
                              <ArrowDownRight size={13} strokeWidth={2.5} />
                            )}
                            {isReceipt ? "Receita" : "Despesa"}
                          </span>
                        </td>

                        <td className="px-5 sm:px-6 py-3.5 font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {t.title === "Outros" ? t.expenseName || "Outros" : t.title}
                        </td>

                        <td className="px-5 sm:px-6 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td
                          className={`px-5 sm:px-6 py-3.5 text-right font-medium tabular-nums whitespace-nowrap ${
                            isReceipt
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isReceipt ? "+ " : "- "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(t.value)}
                        </td>

                        <td className="px-5 sm:px-6 py-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenUpdate(t)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                              title="Editar transação"
                              aria-label={`Editar ${t.title}`}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(t)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                              title="Excluir transação"
                              aria-label={`Excluir ${t.title}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
                          <Receipt size={20} />
                        </div>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          {hasActiveFilters
                            ? "Nenhuma transação encontrada para os filtros aplicados."
                            : "Nenhuma movimentação registrada ainda."}
                        </p>
                        {hasActiveFilters ? (
                          <button
                            onClick={clearFilters}
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-1 cursor-pointer"
                          >
                            Limpar filtros de busca
                          </button>
                        ) : (
                          <Link
                            to="/newtransaction"
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-1"
                          >
                            Cadastrar nova transação &rarr;
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {!loading && totalPages > 1 && (
            <div className="px-5 sm:px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Página <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{currentPage}</strong> de{" "}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Próxima página"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Exclusão (Sleek & Serious) */}
      {deleteModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => !actionLoading && setDeleteModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Excluir transação
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Tem certeza que deseja remover o lançamento{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    &ldquo;{selectedTransaction.title}&rdquo;
                  </strong>{" "}
                  no valor de{" "}
                  <strong className="tabular-nums text-zinc-900 dark:text-zinc-100">
                    R$ {Number(selectedTransaction.value).toFixed(2)}
                  </strong>
                  ? Esta operação não poderá ser desfeita.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
              >
                {actionLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirmar exclusão</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {updateModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => !actionLoading && setUpdateModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Editar Transação
              </h3>
              <button
                onClick={() => setUpdateModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={confirmUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Título / Descrição
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Tipo
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Recebimento">Recebimento</option>
                    <option value="Despesa">Despesa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setUpdateModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {actionLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Salvar alterações</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

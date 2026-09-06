import React, { useState } from "react";
import useTransactions from "../Hooks/useTransactions";
import Header from "../Components/Header";
import {
  Pencil,
  Trash2,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar as CalendarIcon,
} from "lucide-react";

const Transactions = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [getId, setGetId] = useState(null);
  const {
    transactionsList,
    deleteTransaction,
    updateTransaction,
    fetchTransactions,
    loading,
  } = useTransactions();

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
    const matchesTitle = transaction.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType ? transaction.type === filterType : true;
    const matchesDate = filterDate ? transaction.date === filterDate : true;
    return matchesTitle && matchesDate && matchesType;
  });

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const confirmUpdate = async () => {
    if (getId) {
      await updateTransaction(getId, {
        title: editTitle,
        value: Number(editValue),
        date: editDate,
        type: editType,
      });
      await fetchTransactions();
      setUpdateModal(false);
      setGetId(null);
    }
  };

  const handleUpdateClick = (t) => {
    setEditTitle(t.title);
    setEditValue(t.value);
    setEditDate(t.date);
    setEditType(t.type);
    setGetId(t.id);
    setUpdateModal(true);
  };

  const confirmDelete = async () => {
    if (getId) {
      await deleteTransaction(getId);
      setDeleteModal(false);
      setGetId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic">
              Histórico de{" "}
              <span className="text-emerald-500 not-italic">Transações</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Gerencie e filtre seus movimentos financeiros.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título..."
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full md:w-64"
              />
            </div>

            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2.5 rounded-xl border transition-all ${
                showFilterMenu
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-500 hover:border-emerald-500"
              }`}
            >
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* Menu de Filtros Expansível */}
        {showFilterMenu && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Data
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-800 p-2 rounded-lg outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Tipo
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-800 p-2 rounded-lg outline-none cursor-pointer"
              >
                <option value="">Todos</option>
                <option value="Recebimento">Recebimento</option>
                <option value="Despesa">Despesa</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterDate("");
                  setFilterType("");
                }}
                className="text-xs text-rose-500 font-bold hover:underline py-2"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Tabela Premium */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Título
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Data
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="5" className="px-6 py-6">
                          <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded w-full"></div>
                        </td>
                      </tr>
                    ))
                  : paginatedTransactions.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          {t.type === "Recebimento" ? (
                            <ArrowUpCircle
                              className="text-emerald-500"
                              size={20}
                            />
                          ) : (
                            <ArrowDownCircle
                              className="text-rose-500"
                              size={20}
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-sm">
                          {t.title}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {t.date.split("-").reverse().join("/")}
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-bold text-sm ${
                            t.type === "Recebimento"
                              ? "text-emerald-600"
                              : "text-rose-500"
                          }`}
                        >
                          {t.type === "Recebimento" ? "+ " : "- "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(t.value)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleUpdateClick(t)}
                              className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setGetId(t.id);
                                setDeleteModal(true);
                              }}
                              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginação Premium */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 disabled:opacity-30 hover:border-emerald-500 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold text-slate-500">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 disabled:opacity-30 hover:border-emerald-500 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setDeleteModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-gray-800 animate-zoomIn">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-black tracking-tighter italic mb-2 dark:text-white">
                Excluir Transação
                <span className="text-rose-500 not-italic">?</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Esta ação não pode ser desfeita. O registro será removido
                permanentemente do seu histórico.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {updateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setUpdateModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-gray-800 animate-zoomIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tighter italic dark:text-white">
                Editar Transação
                <span className="text-emerald-500 not-italic">.</span>
              </h2>
              <button
                onClick={() => setUpdateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                  Título
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                    Valor
                  </label>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white font-bold"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                    Tipo
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white appearance-none"
                  >
                    <option value="Recebimento">Recebimento</option>
                    <option value="Despesa">Despesa</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                  Data
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                />
              </div>

              <button
                onClick={confirmUpdate}
                className="w-full py-4 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all mt-4"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

import React, { useState } from "react";
import Header from "../Components/Header";
import { db } from "../firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import { Save, ArrowRightLeft, Calendar, Tag, DollarSign } from "lucide-react";

const NewTransaction = () => {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    value: "",
    date: "",
    expenseName: "",
  });

  const formatValue = (value) => {
    return Number(value.replace(",", "."));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedValue = formatValue(formData.value);
      const newTransaction = {
        ...formData,
        value: parsedValue,
        createdAt: new Date(),
      };
      await addDoc(collection(db, "transactions"), newTransaction);
      alert("Lançamento realizado com sucesso");
      setFormData({
        type: "",
        title: "",
        value: "",
        date: "",
        expenseName: "",
      });
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-200 dark:border-gray-800 animate-slideUp">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black tracking-tighter dark:text-white italic">
              Nova Transação
              <span className="text-emerald-500 not-italic">.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Cadastre seus fluxos financeiros com precisão
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seletor de Tipo Premium */}
            <div className="flex p-1 bg-slate-100 dark:bg-gray-800 rounded-2xl gap-1">
              <label
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  formData.type === "Recebimento"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-slate-500"
                }`}
              >
                <input
                  required
                  type="radio"
                  name="type"
                  value="Recebimento"
                  onChange={handleChange}
                  checked={formData.type === "Recebimento"}
                  className="hidden"
                />
                <span>Recebimento</span>
              </label>
              <label
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  formData.type === "Despesa"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-rose-600 dark:text-rose-400 font-bold"
                    : "text-slate-500"
                }`}
              >
                <input
                  type="radio"
                  required
                  name="type"
                  value="Despesa"
                  onChange={handleChange}
                  checked={formData.type === "Despesa"}
                  className="hidden"
                />
                <span>Despesa</span>
              </label>
            </div>

            {formData.type && (
              <div className="space-y-5 animate-fadeIn">
                {/* Título ou Categoria */}
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-2 mb-1 block tracking-widest">
                    {formData.type === "Recebimento" ? "Título" : "Categoria"}
                  </label>
                  <div className="flex items-center">
                    <div className="absolute left-4 text-slate-400">
                      <Tag size={18} />
                    </div>
                    {formData.type === "Recebimento" ? (
                      <input
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white transition-all"
                        type="text"
                        name="title"
                        required
                        placeholder="Ex: Salário Mensal"
                        onChange={handleChange}
                        value={formData.title}
                      />
                    ) : (
                      <select
                        name="title"
                        required
                        onChange={handleChange}
                        value={formData.title}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none dark:text-white appearance-none cursor-pointer transition-all"
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="Contas residenciais">
                          Residência (luz, água)
                        </option>
                        <option value="Condução">Condução</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Educação">Educação</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Outros">Outros</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Campo dinâmico para "Outros" */}
                {formData.title === "Outros" && formData.type === "Despesa" && (
                  <div className="animate-slideDown">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-2 mb-1 block tracking-widest">
                      Qual a despesa?
                    </label>
                    <input
                      required
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none dark:text-white transition-all"
                      type="text"
                      name="expenseName"
                      placeholder="Nome da despesa"
                      onChange={handleChange}
                      value={formData.expenseName}
                    />
                  </div>
                )}

                {/* Valor e Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-2 mb-1 block tracking-widest">
                      Valor
                    </label>
                    <div className="absolute left-4 top-[2.45rem] text-slate-400">
                      <DollarSign size={18} />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white font-bold transition-all"
                      type="number"
                      step="0.01"
                      required
                      name="value"
                      placeholder="0,00"
                      onChange={handleChange}
                      value={formData.value}
                    />
                  </div>

                  <div className="relative">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-2 mb-1 block tracking-widest">
                      Data
                    </label>
                    <div className="absolute left-4 top-[2.45rem] text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white transition-all"
                      type="date"
                      name="date"
                      required
                      onChange={handleChange}
                      value={formData.date}
                    />
                  </div>
                </div>

                {/* Botão de Submit */}
                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mt-4 ${
                    formData.type === "Recebimento"
                      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                      : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                  }`}
                >
                  <Save size={20} />
                  Confirmar Lançamento
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewTransaction;

import React, { useState, useEffect } from 'react'
import useTransactions from '../Hooks/useTransactions'
import Header from '../Components/Header'
import blackPencil from '../assets/icons-black.svg'
import lixeira from '../assets/lixeira.svg'
import ConfirmButton from '../Components/ConfirmButton'
import { FunnelIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const Transactions = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [getId, setGetId] = useState(null)
  const { transactionsList, filteredReceipts, filteredExpenses,deleteTransaction, updateTransaction, fetchTransactions, loading} = useTransactions()

  const [editTitle, setEditTitle] = useState('')
  const [editValue, setEditValue] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editType, setEditType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const filteredTitle = transactionsList.filter(transaction =>
    transaction.title.toLowerCase().includes(search.toLowerCase())
  )
  const [filter, setFilter] = useState(false)
  const transactionsPerPage = 8
  const initialIndex = (currentPage - 1) * transactionsPerPage  
  const finalIndex = currentPage * transactionsPerPage

  
  const confirmUpdate = async () => {
  if(getId){
    try {
      await updateTransaction(getId, {
        title: editTitle,
        value: Number(editValue),
        date: editDate,
        type: editType
      })
      await fetchTransactions()
      setUpdateModal(false)
      setGetId(null)
    } catch (error) {
      console.error("Erro ao atualizar transação:", error)
    }
  }
}

  const handleDeleteClick = (id) =>{
    setDeleteModal(true)
    setGetId(id)
  }

  const handleUpdateClick = (transaction) => {
  setEditTitle(transaction.title);
  setEditValue(transaction.value);
  setEditDate(transaction.date);
  setEditType(transaction.type);
  setGetId(transaction.id);
  setUpdateModal(true);
  }

  const confirmDelete = () =>{
    if(getId){
      deleteTransaction(getId)
      setDeleteModal(false)
      setGetId(null)
    }
  }
  console.log(search)
  return (
    <div className="dark:bg-gray-950 min-h-screen bg-white flex flex-col dark:text-white">
      <Header />
      <h1 className="text-center text-2xl mt-10">Histórico de transações</h1>
      <div className="flex flex-col justify-center gap-5 items-center">
        <div className="flex flex-col justify-center items-start mt-10 gap-5">
          {deleteModal && (
            <>
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
              <div className="fixed z-50 inset-0 flex items-center justify-center animate-center">
                <div
                  className=" flex flex-col justify-evenly fixed backdrop-blur-sm
              dark:bg-gray-900 bg-white dark:text-white z-50 border-slate-300
              dark:border-slate-800 border-2 p-6 rounded-xl max-w-lg gap-10"
                >
                  <h2 className="text-xl">
                    Realmente deseja remover esta transação?
                  </h2>
                  <div className="flex justify-around">
                    <ConfirmButton onClick={confirmDelete}>
                      Confirmar
                    </ConfirmButton>
                    <ConfirmButton
                      onClick={() => setDeleteModal(false)}
                      className=" bg-red-500 dark:bg-red-700"
                    >
                      Cancelar
                    </ConfirmButton>
                  </div>
                </div>
              </div>
            </>
          )}
          {updateModal && (
            <>
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
              <div className="fixed z-50 inset-0 flex items-center justify-center animate-center">
                <div
                  className=" flex flex-col justify-evenly fixed backdrop-blur-sm
              dark:bg-gray-900 bg-white dark:text-white z-50 border-slate-300
              dark:border-slate-800 border-2 p-6 rounded-xl max-w-lg gap-10"
                >
                  <input
                    type="text"
                    placeholder="Título"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
                  />
                  <input
                    type="number"
                    placeholder="Valor"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
                  />
                  <input
                    type="date"
                    placeholder="Data"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
                  />
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="dark:text-white
                  dark:bg-gray-900 focus:outline-none 
                    text-center"
                  >
                    <option value="Recebimento">Recebimento</option>
                    <option value="Despesa">Despesa</option>
                  </select>
                  <div className="flex justify-around">
                    <ConfirmButton onClick={confirmUpdate}>
                      Confirmar
                    </ConfirmButton>
                    <ConfirmButton
                      onClick={() => setUpdateModal(false)}
                      className=" bg-red-500 dark:bg-red-700"
                    >
                      Cancelar
                    </ConfirmButton>
                  </div>
                </div>
              </div>
            </>
          )}
          {!loading && (
            <div className="flex justify-between w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                id="search"
                placeholder="Busca por título"
                className="md:w-68 w-48 border-slate-300 border-1 dark:text-white dark:border-1
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
              />
              <FunnelIcon
                onClick={() => setFilter((prev) => !prev)}
                className="w-6 h-6 cursor-pointer"
              />
              {filter && (
                
                <div className="fixed top-60 right-12 sm:right-42 bg-white border-slate-200 dark:border-slate-700 dark:bg-gray-900 
                                border p-4 rounded shadow-lg z-50 flex flex-col gap-3">
                  <input
                    className="border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
                    type="date"
                    name="date"
                    id="date"
                    required
                  />
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="border p-1 rounded dark:border-slate-700 dark:text-white border-slate-200 dark:bg-gray-900 
                   focus:outline-none"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="Recebimento">Recebimento</option>
                    <option value="Despesa">Despesa</option>
                  </select>
                </div>
              )}
            </div>
          )}
          {loading && (
            <ul className="w-full grid md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <li
                  key={i}
                  className="animate-pulse bg-gray-200 dark:bg-gray-700 h-68 w-68 rounded-lg"
                />
              ))}
            </ul>
          )}
          <ul className="w-full grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2 2xl:grid-cols-4 gap-5 justify-center">
            {filteredTitle
              .slice(initialIndex, finalIndex)
              .map((transaction, index) => (
                <li
                  className="opacity-0 dark:bg-gray-800 bg-gray-100 shadow-slate-500 dark:border-slate-700 border-1 
              border-solid border-slate-200 dark:shadow-slate-700 shadow-sm p-4 flex flex-col items-center 
              justify-center gap-5 h-68 w-68 rounded-lg animate-slideLeft duration-300 hover:scale-105 hover:brightness-110 dark:hover:brightness-125"
                  style={{ animationDelay: `${index * 200}ms` }}
                  key={transaction.id}
                >
                  <div className="flex justify-around w-full">
                    <button className=" bg-gray-300 dark:bg-slate-700 p-1 rounded-lg cursor-pointer">
                      <img
                        src={blackPencil}
                        alt="editar"
                        className="w-6 h-6 text-white dark:invert"
                        onClick={() => handleUpdateClick(transaction)}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(transaction.id)}
                      className=" bg-red-500 dark:bg-red-700 rounded-lg w-8 cursor-pointer"
                    >
                      <img
                        className="dark:invert pl-1"
                        src={lixeira}
                        alt="excluir"
                      />
                    </button>
                  </div>
                  <span>Tipo: {transaction.type}</span>
                  <span>
                    Data:{" "}
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </span>
                  <span>Título: {transaction.title}</span>
                  <span
                    className={`${
                      transaction.type === "Recebimento"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    Valor: {Number(transaction.value).toFixed(2)}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {!loading && (
          <div className="mb-15">
            <button
              className={`transition-opacity duration-500 ${
                currentPage === 1 ? "opacity-50" : "opacity-100"
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              className={` transition-opacity duration-500 ${
                currentPage ===
                Math.ceil(transactionsList.length / transactionsPerPage)
                  ? "opacity-50"
                  : "opacity-100"
              }`}
              disabled={
                currentPage ===
                Math.ceil(transactionsList.length / transactionsPerPage)
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(transactionsList.length / transactionsPerPage)
                  )
                )
              }
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions
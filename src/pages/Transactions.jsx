import React, { useState, useEffect } from 'react'
import useTransactions from '../Hooks/useTransactions'
import Header from '../Components/Header'
import blackPencil from '../assets/icons-black.svg'
import lixeira from '../assets/lixeira.svg'
import ConfirmButton from '../Components/ConfirmButton'

const Transactions = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [getId, setGetId] = useState(null)
  const { transactionsList, filteredReceipts, filteredExpenses,deleteTransaction, updateTransaction} = useTransactions()

  const handleDeleteClick = (id) =>{
    setDeleteModal(true)
    setGetId(id)
  }

  const handleUpdateClick = () => {
    setUpdateModal(true)
  }

  const confirmDelete = () =>{
    if(getId){
      deleteTransaction(getId)
      setDeleteModal(false)
      setGetId(null)
    }
  }

  return (
    <div className='dark:bg-gray-950 min-h-screen bg-white flex flex-col dark:text-white'>
      <Header/>
        <h1 className='text-center text-2xl mt-10'>Histórico de transações</h1>
        <div className='flex justify-center mt-20'>
          {deleteModal && (
            <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
            <div className='fixed z-50 inset-0 flex items-center justify-center animate-center'>
              <div className=' flex flex-col justify-evenly fixed backdrop-blur-sm
              dark:bg-gray-900 bg-white dark:text-white z-50 border-slate-300
              dark:border-slate-800 border-2 p-6 rounded-xl max-w-lg gap-10'>
                <h2 className='text-xl'>Realmente deseja remover esta transação?</h2>
                <div className='flex justify-around'>
                  <ConfirmButton onClick={confirmDelete}>Confirmar</ConfirmButton>
                  <ConfirmButton onClick={() => setDeleteModal(false)} className=' bg-red-500 dark:bg-red-700'>Cancelar</ConfirmButton>
                </div>
              </div>
            </div>
            </>
            
          )}
          
          <ul className='w-full flex flex-wrap gap-5 justify-center'>
            {transactionsList.map((transaction, index) =>(
            
              <li className='opacity-0 dark:bg-gray-800 bg-gray-100 shadow-slate-500 dark:border-slate-700 border-1 
              border-solid border-slate-200 dark:shadow-slate-700 shadow-sm p-4 flex flex-col items-center 
              justify-center gap-5 h-68 w-68 rounded-lg animate-slideLeft duration-300 hover:scale-105 hover:brightness-110 dark:hover:brightness-125' 
              style={{ animationDelay: `${index * 200}ms` }} key={transaction.id}>
                <div className='flex justify-around w-full'>
                  <button className=' bg-gray-300 dark:bg-slate-700 p-1 rounded-lg cursor-pointer'>
                    <img src={blackPencil} alt="editar" className='w-6 h-6 text-white dark:invert' />
                  </button>
                  <button onClick={() => handleDeleteClick(transaction.id)} className=' bg-red-500 dark:bg-red-700 rounded-lg w-8 cursor-pointer'>
                    <img className='dark:invert pl-1' src={lixeira} alt="excluir" />
                  </button>
                </div>
                <span>Tipo: {transaction.type}</span>
                <span>Data: {transaction.date}</span>
                <span>Título: {transaction.title}</span>
                <span className={`${transaction.type === 'Recebimento' ? 'text-green-600' : 'text-red-500'}`}>Valor: {Number(transaction.value).toFixed(2)}</span>
              </li>
            
            
        ))}
      </ul>
        </div>
    </div>
  )
}

export default Transactions
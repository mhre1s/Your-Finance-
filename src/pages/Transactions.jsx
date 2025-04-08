import React, { useState, useEffect } from 'react'
import useTransactions from '../Hooks/useTransactions'
import Header from '../Components/Header'
import pencil from '../assets/icons8-editar (1).svg'

const Transactions = () => {

  const { transactionsList, error, filteredReceipts, filteredExpenses, loading} = useTransactions()

  return (
    <div className='dark:bg-gray-950 min-h-screen bg-white flex flex-col dark:text-white'>
      <Header/>
        <h1 className='text-center text-2xl mt-10'>Histórico de transações</h1>
        <div className='flex justify-center mt-20'>
          <ul className='w-full flex flex-wrap gap-5 justify-center'>
           
            
            {transactionsList.map((transaction, index) =>(
            
              <li className='opacity-0 dark:bg-gray-800 bg-gray-100 shadow-slate-500 dark:border-slate-700 border-1 
              border-solid border-slate-200 dark:shadow-slate-700 shadow-sm p-4 flex flex-col items-center 
              justify-center gap-5 h-68 w-68 rounded-lg animate-slideLeft duration-300 hover:scale-105 hover:brightness-120' 
              style={{ animationDelay: `${index * 200}ms` }} key={transaction.id}>
                <div>
                  <button>
                    <img src={pencil} alt="editar" className='w-6 h-6' />

                    
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
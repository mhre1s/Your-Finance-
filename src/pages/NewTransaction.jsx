import React, { useState } from 'react'
import Header from '../Components/Header'

const NewTransaction = () => {
  const [transactionType, setTransactionType] = useState('')

  return (
    <div className='bg-amber-50 dark:bg-gray-950 min-h-screen flex flex-col'>
        <Header/>
        <h2 className='text-center text-2xl mt-10 dark:text-white'>Adicionar transação</h2>
        <div className='flex justify-center mt-20'>
          <form className='grid grid-cols-2 items-center w-96 gap-y-5 p-8 shadow-slate-500 dark:shadow-slate-800 bg-gray-100 shadow-md dark:bg-gray-800 rounded-xl'>
              <div className=' flex justify-center col-span-2 gap-2'>
                <label htmlFor="incoming">
                  <span className='dark:text-white'>Recebimento</span>
                </label>
                <input type="radio" name="transaction-type" id="incoming" value="recebimento" onChange={(e) => setTransactionType(e.target.value)} />
                <label htmlFor="expenses">
                  <span className='dark:text-white'>Despesa</span>
                </label>
                <input type="radio" name="transaction-type" id="expenses" value="despesa" onChange={(e) => setTransactionType(e.target.value)} />
              </div>

              {transactionType === 'recebimento' && (
                <>
                <label htmlFor="value">
                <span className='dark:text-white'>Título</span>
              </label>
              <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                dark:border-slate-700 rounded-lg p-1.5 
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                type="number" name="value" id="value" />
              <label htmlFor="value">
                <span className='dark:text-white'>Valor de recebimento</span>
              </label>
              <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                dark:border-slate-700 rounded-lg p-1.5 
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                type="number" name="value" id="value" />
              <label htmlFor="value">
                <span className='dark:text-white'>Data</span>
              </label>
              <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                dark:border-slate-700 rounded-lg p-1.5 
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                type="date" name="value" id="value" />
                </>
              )}
              
          </form>  
        </div>
    </div>
  )
}

export default NewTransaction
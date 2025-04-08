import React from 'react'
import Header from '../Components/Header'
import TransactionCard from '../Components/TransactionCard'
import TransactionRedCard from '../Components/TransactionRedCard'
import TransactionNeutralCard from '../Components/TransactionNeutralCard'
import useTransactions from '../Hooks/useTransactions'

const Dashboard = () => {

  const { lastFour, error, filteredReceipts, filteredExpenses, loading} = useTransactions()
  const reducedReceipts = filteredReceipts.reduce((acc, val)=>  acc + Number(val.value),0)
  const reducedExpenses = filteredExpenses.reduce((acc, val)=>  acc + Number(val.value),0)

  const amount = reducedReceipts - reducedExpenses

  return (
    <div className='dark:bg-gray-950 min-h-screen bg-white flex flex-col'>
      <Header/>
      <div className='flex flex-col items-center justify-center gap-10 grow mt-10'>
        {loading && (
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 dark:border-white border-slate-950"></div>
        )}
        {!loading &&(
          <>
           <div className='flex flex-col md:flex-row justify-center items-center gap-10'>
              <TransactionCard receipts={reducedReceipts}/>
              <TransactionRedCard expenses={reducedExpenses} />
          </div>
        
          <div>
          <TransactionNeutralCard amount={amount}/>
          </div>
          </>
        )}
       
        <h4 className='dark:text-white text-2xl'>Últimas transações</h4>
        <div className='border-1 border-solid border-slate-200 rounded-xl dark:border-gray-700'>
          <table className='dark:text-white text-center rounded-xl dark:bg-gray-800 bg-slate-100'>
            <thead>
              <tr>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {loading &&(
                [1,2,3,4].map((_,i)=>(
                  <tr key={i} className='animate-bounce'>
                    <td className="px-6 py-3"><div className="h-2 bg-gray-400 rounded w-20 mx-auto" /></td>
                    <td className="px-6 py-3"><div className="h-2 bg-gray-400 rounded w-20 mx-auto" /></td>
                    <td className="px-6 py-3"><div className="h-2 bg-gray-400 rounded w-20 mx-auto" /></td>
                    <td className="px-6 py-3"><div className="h-2 bg-gray-400 rounded w-20 mx-auto" /></td>
                  </tr>
                ))
              )}
              {lastFour.map((transaction)=>(
                <tr key={transaction.id}>
                  <td className="px-6 py-3">{transaction.type}</td>
                  <td className="px-6 py-3">{transaction.title === "Outros" ? transaction.expenseName : transaction.title}</td>
                  <td className="px-6 py-3"> {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                    }).format(transaction.value)}</td>
                  <td className="px-6 py-3">{transaction.date}</td>
                </tr>
              ))}
              <tr>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

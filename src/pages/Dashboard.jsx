import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import TransactionCard from '../Components/TransactionCard'
import TransactionRedCard from '../Components/TransactionRedCard'
import TransactionNeutralCard from '../Components/TransactionNeutralCard'
const Dashboard = () => {
  const [receipts, setReceipts] = useState(900)
  const [expenses, setExpenses] = useState(780)
  const [amount, setAmount] = useState(0)
  const transactions = [
    {id: 1, type: 'Despesa', title: 'Conta de luz', amount: 170, date:'25/02/25'},
    {id: 1, type: 'Recebimento', title: 'Ações Trisul', amount: 195.76, date:'27/02/25'},
    {id: 1, type: 'Recebimento', title: 'Venda de mouse', amount: 327.52, date:'21/02/25'},
    {id: 1, type: 'Despesa', title: 'Conta de água', amount: 192.11, date:'10/02/25'},
  ]
  useEffect(()=>{
    setAmount(receipts - expenses)
  },[receipts,expenses])
  return (
    <div className='dark:bg-gray-950 min-h-screen bg-amber-50 flex flex-col'>
      <Header/>
      <div className='flex flex-col items-center justify-center gap-10 grow mt-10'>
        <div className='flex flex-col md:flex-row justify-center items-center gap-10'>
          <TransactionCard receipts={receipts}/>
          <TransactionRedCard expenses={expenses} />
        </div>
        <div>
          <TransactionNeutralCard amount={amount}/>
        </div>
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
              {transactions.map((transaction)=>(
                <tr key={transaction.id}>
                  <td className="px-6 py-3">{transaction.type}</td>
                  <td className="px-6 py-3">{transaction.title}</td>
                  <td className="px-6 py-3">{transaction.amount.toFixed(2)}</td>
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

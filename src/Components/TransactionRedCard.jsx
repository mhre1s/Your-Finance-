import React from 'react'
import { ArrowDown } from "lucide-react"
const TransactionRedCard = ({expenses}) => {

  const formattedExpenses = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(expenses)

  return (
    <div>
      <div className='bg-red-700 rounded-xl w-72 h-40 text-white flex justify-center items-center flex-col gap-9'>
        <div className='flex gap-3'>
            <h2 className='text-xl'>Despesas</h2>
            <div className='bg-white rounded-4xl w-6 h-6'><ArrowDown className='text-red-700' size={24}/></div>
        </div>
        <div>
            <h3 className='text-xl'>{formattedExpenses}</h3>
        </div>
      </div>
    </div>
  )
}

export default TransactionRedCard

import React from 'react'
import { ArrowUp } from "lucide-react"
import { ArrowDown } from "lucide-react"
const TransactionNeutralCard = ({amount}) => {

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)

  return (
    <div>
    <div className={`${amount > 0 ? 'bg-green-700' : 'bg-red-700'} animate-pulse rounded-xl w-72 h-40 
    text-white flex justify-center items-center flex-col gap-9 md:w-90 md:h-50`}>
        <div className='flex gap-3'>
            <h2 className='text-xl'>Lucro/Prejuízo(mês)</h2>
            <div className='bg-white rounded-4xl w-6 h-6'>{amount > 0 ? <ArrowUp className='text-green-700' size={24}/> : <ArrowDown className='text-red-700' size={24}/>}</div>
        </div>
        <div>
            <h3 className='text-xl'>{formattedAmount}</h3>
        </div>
      </div>
    </div>
  )
}

export default TransactionNeutralCard
import React from 'react'
import { ArrowUp } from "lucide-react"

const TransactionCard = () => {
  return (
    <div>
      <div className='bg-green-700 rounded-xl w-72 h-40 text-white flex justify-center items-center flex-col gap-9'>
        <div className='flex gap-3'>
            <h2 className='text-xl'>Recebimentos</h2>
            <div className='bg-white rounded-4xl w-6 h-6'><ArrowUp className='text-green-700' size={24}/></div>
        </div>
        <div>
            <h3 className='text-xl'>R$700,00</h3>
        </div>
      </div>
    </div>
  )
}

export default TransactionCard

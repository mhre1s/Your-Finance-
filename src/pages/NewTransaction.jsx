import React, { useState } from 'react'
import Header from '../Components/Header'

const NewTransaction = () => {
  const [newInput, setNewInput] = useState('')

  const activateInput =(e)=>{
    e.preventDefault()

  }
  return (
    <div className='bg-amber-50 dark:bg-gray-950 min-h-screen flex flex-col'>
        <Header/>
        <h2 className='text-center text-2xl mt-10 dark:text-white'>Adicionar transação</h2>
        <div className='grow flex justify-center mt-20'>
          <form className='flex flex-col w-72 items-center'>
            <div className='flex flex-col items-center gap-2'>
              <label htmlFor="value">
              <span className='dark:text-white'>Digite um valor</span>
              </label>
              <input className='border-slate-300 border-1 shadow-slate-500 dark:text-white dark:border-1 text-center dark:shadow-slate-800 shadow-lg 
                dark:border-slate-700 rounded-lg p-1.5 
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                type="number" name="value" id="value" />
                <button onClick={activateInput} className='shadow-lg  border-slate-300 shadow-slate-500 dark:shadow-slate-800 border-1 hover:bg-slate-300 dark:border-slate-700 rounded-lg p-2 dark:text-white mt-1 dark:hover:bg-slate-700 cursor-pointer duration-300'>Confirmar</button>
            </div> 
          </form>  
        </div>
    </div>
  )
}

export default NewTransaction
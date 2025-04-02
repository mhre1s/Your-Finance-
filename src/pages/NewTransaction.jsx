import React, { useState } from 'react'
import Header from '../Components/Header'

const NewTransaction = () => {

  const handleSubmit = (e) =>{
    e.preventDefault()
    const newTransaction = {...formData}
    setTransactions(prevTransaction =>[...prevTransaction, newTransaction])
    setFormData({
      type: '',
      category: '',
      title: '',
      value: '',
      date: '',
      expenseName: ''
    })
    
  }

const [transactions, setTransactions] = useState([]);
const handleChange = (e) =>{
  const {name,value} = e.target
  setFormData(prevData =>({
    ...prevData,
    [name]: value
  }))
}
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    title: '',
    value: '',
    date: '',
    expenseName: ''
  })
  return (
    <div className='bg-amber-50 dark:bg-gray-950 min-h-screen flex flex-col'>
        <Header/>
        <h2 className='text-center text-2xl mt-10 dark:text-white'>Adicionar transação</h2>
        <div className='flex justify-center mt-20'>
          <form onSubmit={handleSubmit} className='grid grid-cols-2 items-center w-96 gap-y-5 p-8 shadow-slate-500 dark:shadow-slate-800 bg-gray-100 shadow-md dark:bg-gray-800 rounded-xl'>
              <div className=' flex justify-center col-span-2 gap-2'>
                <label htmlFor="incoming">
                  <span className='dark:text-white'>Recebimento</span>
                </label>
                <input type="radio" name="type" id="incoming" value="recebimento" onChange={handleChange} checked={formData.type === 'recebimento'} />
                <label htmlFor="expenses">
                  <span className='dark:text-white'>Despesa</span>
                </label>
                <input type="radio" name="type" id="expenses" value="despesa" onChange={handleChange} checked={formData.type === 'despesa'} />
              </div>

              {formData.type === 'recebimento' && (
                <>
                  <label htmlFor="title">
                    <span className='dark:text-white'>Título</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="text" name="title" id="title" onChange={handleChange} value={formData.title} />

                  <label htmlFor="value">
                    <span className='dark:text-white'>Valor de recebimento</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="number" name="value" id="value" onChange={handleChange} value={formData.value} />

                  <label htmlFor="date">
                    <span className='dark:text-white'>Data</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="date" name="date" id="date" onChange={handleChange} value={formData.date} />
                </>
              )}
              {formData.type === 'despesa' && (
                <>
                  <label htmlFor="category">
                    <span className='dark:text-white'>Categoria</span>
                  </label>
                  <select value={formData.category} onChange={handleChange} className='dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none text-center' name="category" id="category">
                    <option value="">Categoria</option>
                    <option value="contas-residenciais">Residência (luz,água)</option>
                    <option value="condução">Condução</option>
                    <option value="lazer">Alimentação</option>
                    <option value="educação">Educação</option>
                    <option value="saúde">Saúde</option>
                    <option value="Outros">Outros</option>
                  </select>
                  {formData.category === 'Outros' &&(
                  <>
                  <label htmlFor="">
                    <span className='dark:text-white'>Nome de sua despesa</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="text" name="expenseName" id="expense-name" onChange={handleChange} value={formData.expenseName} />
                  </>
                
                  )}
                  <label htmlFor="value">
                    <span className='dark:text-white'>Valor de recebimento</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="number" name="value" id="value" onChange={handleChange} value={formData.value} />

                  <label htmlFor="date">
                    <span className='dark:text-white'>Data</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="date" name="date" id="date" onChange={handleChange} value={formData.date} />
                </>
              )}
              <div className='flex justify-center col-span-2 mt-5'>
                <input className='text-white bg-green-700 rounded-lg p-5 text-md hover:bg-green-500 cursor-pointer duration-300' type="submit" value="Confirmar" />
              </div>
              
          </form>  
        </div>
    </div>
  )
}

export default NewTransaction
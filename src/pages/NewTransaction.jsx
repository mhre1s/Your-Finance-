import React, { useState, useEffect } from 'react'
import Header from '../Components/Header'

import { db } from '../firebaseconfig'
import { collection, addDoc,} from 'firebase/firestore'

const NewTransaction = () => {

  const formatValue = (value) => {
  return Number(value.replace(',', '.'))
}

  const handleSubmit = async (e) =>{
    e.preventDefault()
    
    try {
      const parsedValue = formatValue(formData.value)
      const newTransaction = {...formData, 
        value:parsedValue, 
        createdAt: new Date()}
      await addDoc(collection(db, "transactions"), newTransaction)
      alert('Lançamento realizado com sucesso')
      setFormData({
      type: '',
      title: '',
      value: '',
      date: '',
      expenseName: ''
    })
    } 
    catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  }

const handleChange = (e) =>{
  const {name,value} = e.target
  setFormData(prevData =>({
    ...prevData,
    [name]: value
  }))
}

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    value: '',
    date: '',
    expenseName: ''
  })

  return (
    <div className='bg-white dark:bg-gray-950 min-h-screen flex flex-col'>
        <Header/>
        <h2 className='text-center text-2xl mt-10 dark:text-white'>Adicionar transação</h2>
        <div className='flex justify-center mt-20'>
          <form onSubmit={handleSubmit} className=' animate-slideUp grid grid-cols-2 items-center w-96 gap-y-5 p-8 
          shadow-slate-500 dark:shadow-slate-800 bg-gray-100 shadow-md 
           dark:bg-gray-800 rounded-xl'>
              <div className=' flex justify-center col-span-2 gap-2'>
                <label htmlFor="incoming">
                  <span className='dark:text-white'>Recebimento</span>
                </label>
                <input required type="radio" name="type" id="incoming" value="Recebimento" onChange={handleChange} checked={formData.type === 'Recebimento'} />
                <label htmlFor="expenses">
                  <span className='dark:text-white'>Despesa</span>
                </label>
                <input type="radio" required name="type" id="expenses" value="Despesa" onChange={handleChange} checked={formData.type === 'Despesa'} />
              </div>

              {formData.type === 'Recebimento' && (
                <>
                  <label htmlFor="title">
                    <span className='dark:text-white'>Título</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="text" name="title" id="title" required onChange={handleChange} value={formData.title} />

                  <label htmlFor="value">
                    <span className='dark:text-white'>Valor da transação</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="number" name="value" id="value" required onChange={handleChange} value={formData.value} />

                  <label htmlFor="date">
                    <span className='dark:text-white'>Data</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="date" name="date" id="date" required onChange={handleChange} value={formData.date} />
                </>
              )}
              {formData.type === 'Despesa' && (
                <>
                  <label htmlFor="category">
                    <span className='dark:text-white'>Categoria</span>
                  </label>
                  <select value={formData.title} required onChange={handleChange} className='dark:text-white bg-gray-100 
                  dark:bg-gray-800 focus:outline-none 
                    text-center' name="title" id="category">
                    <option value="">Categoria</option>
                    <option value="Contas residenciais">Residência (luz,água)</option>
                    <option value="Condução">Condução</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Outros">Outros</option>
                  </select>
                  {formData.title === 'Outros' &&(
                  <>
                  <label htmlFor="">
                    <span className='dark:text-white'>Nome de sua despesa</span>
                  </label>
                  <input required className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="text" name="expenseName" id="expense-name" onChange={handleChange} value={formData.expenseName} />
                  </>
                
                  )}
                  <label htmlFor="value">
                    <span className='dark:text-white'>Valor da transação</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="number" step='0.01' required name="value" id="value" onChange={handleChange} value={formData.value} />

                  <label htmlFor="date">
                    <span className='dark:text-white'>Data</span>
                  </label>
                  <input className='border-slate-300 border-1 dark:text-white dark:border-1 text-center 
                    dark:border-slate-700 rounded-lg p-1.5 
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0'
                    type="date" name="date" required id="date" onChange={handleChange} value={formData.date} />
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
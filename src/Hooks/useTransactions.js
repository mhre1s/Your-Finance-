
import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseconfig'

const useTransactions = () => {

    const [transactionsList, setTransactionsList] = useState([])
    const [lastFour, setLastFour] = useState([])
    const [filteredReceipts, setFilteredReceipts] = useState([])
    const [filteredExpenses, setFilteredExpenses] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
    const fetchData = async()=>{
      try {
        setLoading(true)
        const query = await getDocs(collection(db,'transactions'));
        const data = query.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTransactionsList(data)
        const ordened = data.sort((a,b)=> new Date(b.date) - new Date(a.date))
        setLastFour(ordened.slice(0,4))

        const filterReceipts = data.filter(trs => trs.type === "Recebimento")
        setFilteredReceipts(filterReceipts)

        const filterExpenses = data.filter(trs => trs.type === "Despesa")
        setFilteredExpenses(filterExpenses)
      } 
      catch (err) {
        setError(err)
      }
      finally{
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const deleteTransaction = async (id) => {
    try {
        await deleteDoc(doc(db, 'transactions', id))
        setTransactionsList(prev => prev.filter(trs => trs.id !== id))
    } catch (error) {
        console.error('Erro ao deletar', error)
    }
}

const updateTransaction = async(id) =>{
  const docUpdated = doc(db, 'transactions', id);
  try {
    await updateDoc(docUpdated, newData)
  } catch (error) {
    console.error('Documento atualizado')
  }
}

    return {transactionsList, lastFour, error, 
      filteredReceipts, filteredExpenses, loading, deleteTransaction, updateTransaction}
}

export default useTransactions
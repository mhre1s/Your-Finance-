import React, { useState, useEffect } from 'react'
import { db } from '../firebaseconfig'
import { collection, getDocs } from 'firebase/firestore'

const Transactions = () => {
  const [transactionsList, setTransactionsList] = useState([])
  useEffect(()=>{
    const fetchData = async()=>{
      try {
        const query = await getDocs(collection(db,'transactions'));
        const data = query.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTransactionsList(data)
      } 
      catch (error) {
        console.log('Erro ao buscar dados', error)
      }
    }
    fetchData()
  }, [])
  console.log(transactionsList)
  return (
    <div>
      <ul>
        {transactionsList.map(transaction =>(
          <li key={transaction.id}>
          {transaction.type} - {transaction.title} - {Number(transaction.value).toFixed(2)} - {transaction.date}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Transactions
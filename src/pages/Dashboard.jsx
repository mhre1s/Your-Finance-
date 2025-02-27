import React from 'react'
import Header from '../Components/Header'
import TransactionCard from '../Components/TransactionCard'
import TransactionRedCard from '../Components/TransactionRedCard'
const Dashboard = () => {
  return (
    <div className='dark:bg-gray-950 h-screen bg-amber-50 flex flex-col'>
      <Header/>
      <div className='flex flex-col md:flex-row justify-center items-center grow gap-10'>
        <TransactionCard/>
        <TransactionRedCard/>
      </div>
      
    </div>
  )
}

export default Dashboard

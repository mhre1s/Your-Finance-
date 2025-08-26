import React from 'react'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import useTransactions from "../Hooks/useTransactions";

const BarChartComp = () => {
    
  const {transactionsList} = useTransactions()
  const data = transactionsList.reduce((acc, trans)=>{
    const month = new Date(trans.date).toLocaleString("default",{month: "short", year: "numeric" })
    let monthData = acc.find(item => item.month === month )
    if (!monthData){
      monthData = {
        month,
        Recebimento: 0,
        Despesa: 0,
        _date: new Date(trans.date),
      };
      acc.push(monthData)
    }
    if (trans.type === 'Recebimento'){
      monthData.Recebimento += trans.value
    }
    else{
      monthData.Despesa += trans.value
    }
    return acc
  }, [])
  
data.sort((a, b) => a._date - b._date);

  return (
    <BarChart width={930} height={500} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey={"month"} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Recebimento" fill="#22C55E" barSize={14} />
      <Bar dataKey="Despesa" fill="#EF4444" barSize={14} />
    </BarChart>
  );
}

export default BarChartComp
import React from 'react'
import { Pie, PieChart, ResponsiveContainer, Cell, Legend} from "recharts";
import useTransactions from '../Hooks/useTransactions';

const PieCharts = ({startDate, endDate}) => {
    const { transactionsList } = useTransactions();
      {
    /* filtrando os meses */
  }
    const filterData = startDate && endDate? transactionsList.filter((trs) =>{
      return trs.date >= startDate && trs.date <= endDate
    }): transactionsList;
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF", "#FF6699"];
    const reduceData = filterData.reduce((acc,trs)=>{
      const title = trs.title
      let titleExp = acc.find(item => item.name === title)
      if(!titleExp){
        titleExp = {
          name: title,
          value: 0
        }
      acc.push(titleExp)}
      if(trs.type === 'Despesa'){
        titleExp.value += trs.value
      }
      return acc
    },[])
    const data = reduceData.filter((item) => item.value > 0);

  return (
    <ResponsiveContainer width="100%" height={600}>
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={360}
          endAngle={0}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieCharts
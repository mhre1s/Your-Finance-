import React from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import useTransactions from "../Hooks/useTransactions";


const BarChartYearly = ({startDate, endDate}) => {

{
  /* filtrando os meses */
}

const { transactionsList } = useTransactions();

const filteredData =
  startDate && endDate
    ? transactionsList.filter((trs) => {
        return trs.date >= startDate && trs.date <= endDate;
      })
    : transactionsList;

{
  /* agrupando os meses */
}
const data = filteredData.reduce((acc, trans) => {
  const year = new Date(trans.date).getFullYear()
  let yearData = acc.find((item) => item.year === year);
  if (!yearData) {
    yearData = {
      year,
      Recebimento: 0,
      Despesa: 0,
      _date: new Date(trans.date),
    };
    acc.push(yearData);
  }
  if (trans.type === "Recebimento") {
    yearData.Recebimento += trans.value;
  } else {
    yearData.Despesa += trans.value;
  }
  return acc;
}, []);
{
  /*ordenando os meses decrescentemente no gráfico*/
}
data.sort((a, b) => a._date - b._date);

  return (
    <BarChart width={830} height={500} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey={"year"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Recebimento" fill="#22C55E" barSize={14} />
          <Bar dataKey="Despesa" fill="#EF4444" barSize={14} />
        </BarChart>
  )
}

export default BarChartYearly
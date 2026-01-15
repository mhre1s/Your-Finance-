import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useTransactions from "../Hooks/useTransactions";

const BarChartComp = ({ startDate, endDate }) => {
  const { transactionsList } = useTransactions();

  // 1. Filtragem dos dados
  const filteredData =
    startDate && endDate
      ? transactionsList.filter(
          (trs) => trs.date >= startDate && trs.date <= endDate
        )
      : transactionsList;

  // 2. Agrupamento por mês
  const data = filteredData.reduce((acc, trans) => {
    const month = new Date(trans.date).toLocaleString("pt-BR", {
      month: "short",
      year: "2-digit",
    });
    let monthData = acc.find((item) => item.month === month);

    if (!monthData) {
      monthData = {
        month,
        Recebimento: 0,
        Despesa: 0,
        _date: new Date(trans.date),
      };
      acc.push(monthData);
    }

    if (trans.type === "Recebimento") {
      monthData.Recebimento += trans.value;
    } else {
      monthData.Despesa += trans.value;
    }
    return acc;
  }, []);

  // 3. Ordenação
  data.sort((a, b) => a._date - b._date);

  return (
    /* height="100%" para respeitar os 350px que definimos no componente pai */
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
      >
        {/* Grade apenas horizontal e bem sutil */}
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e2e8f0"
          opacity={0.5}
        />

        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
          dy={10} // Afasta o texto do eixo
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          width={40}
        />

        <Tooltip
          cursor={{ fill: "#f1f5f9", opacity: 0.4 }}
          contentStyle={{
            borderRadius: "16px",
            border: "none",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            padding: "12px",
          }}
        />

        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{
            paddingBottom: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        />

        {/* Barras Arredondadas (radius) e Cores Premium */}
        <Bar
          dataKey="Recebimento"
          fill="#10b981" // Emerald 500
          radius={[4, 4, 0, 0]}
          barSize={12}
        />
        <Bar
          dataKey="Despesa"
          fill="#f43f5e" // Rose 500
          radius={[4, 4, 0, 0]}
          barSize={12}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;

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

const BarChartYearly = ({ startDate, endDate }) => {
  const { transactionsList } = useTransactions();

  // 1. Filtragem (mesma lógica do mensal)
  const filteredData =
    startDate && endDate
      ? transactionsList.filter(
          (trs) => trs.date >= startDate && trs.date <= endDate
        )
      : transactionsList;

  // 2. Agrupamento por Ano
  const data = filteredData.reduce((acc, trans) => {
    const year = new Date(trans.date).getFullYear();
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

  // 3. Ordenação
  data.sort((a, b) => a._date - b._date);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
      >
        {/* Grade sutil apenas horizontal */}
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e2e8f0"
          opacity={0.5}
        />

        <XAxis
          dataKey="year"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }}
          dy={10}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          width={45}
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

        {/* Estilo das Barras seguindo o padrão Emerald e Rose */}
        <Bar
          dataKey="Recebimento"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          barSize={20} // Barras anuais podem ser um pouco mais largas
        />
        <Bar
          dataKey="Despesa"
          fill="#f43f5e"
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartYearly;

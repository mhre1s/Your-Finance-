import React from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import useTransactions from "../Hooks/useTransactions";

const PieCharts = ({ startDate, endDate }) => {
  const { transactionsList } = useTransactions();

  const filterData =
    startDate && endDate
      ? transactionsList.filter(
          (trs) => trs.date >= startDate && trs.date <= endDate
        )
      : transactionsList;

  // Paleta de cores moderna (mais suave)
  const COLORS = [
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#f43f5e",
    "#8b5cf6",
    "#ec4899",
  ];

  const reduceData = filterData.reduce((acc, trs) => {
    // Focamos apenas em Despesas para o gráfico de pizza ser útil
    if (trs.type === "Despesa") {
      const title = trs.title;
      let titleExp = acc.find((item) => item.name === title);
      if (!titleExp) {
        titleExp = { name: title, value: 0 };
        acc.push(titleExp);
      }
      titleExp.value += trs.value;
    }
    return acc;
  }, []);

  const data = reduceData.filter((item) => item.value > 0);

  return (
    // Altura 100% para caber no card que definimos
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="45%" // Sobe um pouco a pizza para dar espaço para a legenda embaixo
          innerRadius={60} // Transforma em rosquinha (Premium Look)
          outerRadius={80}
          paddingAngle={5} // Espaço entre as fatias
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            fontSize: "12px",
          }}
          formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
        />

        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{
            paddingTop: "20px",
            fontSize: "11px",
            fontWeight: "600",
            color: "#64748b",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieCharts;

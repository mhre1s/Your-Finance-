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

  // Paleta de despesas com tons vermelhos, corais e quentes (sem verde)
  const COLORS = [
    "#f43f5e", // Vermelho / Rose primário de despesa
    "#e11d48", // Vermelho carmesim
    "#fb7185", // Coral / Rose suave
    "#f97316", // Laranja queimado
    "#f59e0b", // Âmbar
    "#d97706", // Ocre escuro
    "#8b5cf6", // Violeta
    "#ec4899", // Magenta
  ];

  const reduceData = filterData.reduce((acc, trs) => {
    const isExpense =
      trs.type === "Despesa" ||
      trs.type === "DESPESA" ||
      trs.type === "saida";

    if (isExpense) {
      const categoryName = trs.category?.name || "Outros";
      const categoryColor = trs.category?.color || null;
      let categoryItem = acc.find((item) => item.name === categoryName);
      if (!categoryItem) {
        categoryItem = { name: categoryName, value: 0, color: categoryColor };
        acc.push(categoryItem);
      }
      categoryItem.value += Number(trs.value);
    }
    return acc;
  }, []);

  const data = reduceData.filter((item) => item.value > 0);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400">
        Nenhuma despesa no período.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={75}
          paddingAngle={4}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Despesa"]}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid rgba(113, 113, 122, 0.2)",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            backgroundColor: "rgba(24, 24, 27, 0.95)",
            color: "#f4f4f5",
            fontSize: "12px",
            padding: "8px 12px",
          }}
        />

        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            paddingTop: "12px",
            fontSize: "11px",
            fontWeight: "500",
            color: "#a1a1aa",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieCharts;

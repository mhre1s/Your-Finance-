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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const categoryName = item.payload?.name || item.name || "Despesa";
      const value = item.value;
      const sliceColor =
        item.payload?.fill ||
        item.payload?.color ||
        item.color ||
        "#f43f5e";

      return (
        <div className="bg-zinc-900/95 border border-zinc-700/80 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: sliceColor }}
            />
            <span className="text-xs font-medium text-zinc-300">
              {categoryName}:
            </span>
            <span className="text-xs font-semibold text-white font-mono">
              {formatCurrency(Number(value))}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

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
          nameKey="name"
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={75}
          paddingAngle={4}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />

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

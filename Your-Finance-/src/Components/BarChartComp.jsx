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

  const MONTH_NAMES_SHORT = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  const MONTH_NAMES_FULL = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  // 2. Agrupamento inequívoco por mês e ano (ex: "Set/2026")
  const data = filteredData.reduce((acc, trans) => {
    const dateParts = typeof trans.date === "string" ? trans.date.split("-") : [];
    const year = dateParts[0] || new Date(trans.date).getFullYear();
    const monthIdx = dateParts[1] ? Number(dateParts[1]) - 1 : new Date(trans.date).getMonth();

    const shortLabel = `${MONTH_NAMES_SHORT[monthIdx]}/${year}`; // Ex: "Set/2026"
    const fullLabel = `${MONTH_NAMES_FULL[monthIdx]} de ${year}`; // Ex: "Setembro de 2026"

    let monthData = acc.find((item) => item.month === shortLabel);

    if (!monthData) {
      monthData = {
        month: shortLabel,
        fullLabel,
        Receita: 0,
        Despesa: 0,
        _sortKey: `${year}-${String(monthIdx + 1).padStart(2, "0")}`,
      };
      acc.push(monthData);
    }

    const isReceipt =
      trans.type === "Recebimento" ||
      trans.type === "RECEBIMENTO" ||
      trans.type === "receita";

    if (isReceipt) {
      monthData.Receita += trans.value;
    } else {
      monthData.Despesa += trans.value;
    }
    return acc;
  }, []);

  data.sort((a, b) => a._sortKey.localeCompare(b._sortKey));

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#71717a"
          opacity={0.15}
        />

        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 12 }}
          dy={10}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          tickFormatter={(val) =>
            val >= 1000 ? `R$ ${(val / 1000).toFixed(0)}k` : `R$ ${val}`
          }
          width={65}
        />

        <Tooltip
          formatter={(value, name) => [formatCurrency(Number(value)), name]}
          labelFormatter={(label, payload) => {
            if (payload && payload.length && payload[0]?.payload?.fullLabel) {
              return payload[0].payload.fullLabel;
            }
            return label;
          }}
          cursor={{ fill: "rgba(113, 113, 122, 0.08)" }}
          itemStyle={{ color: "#f4f4f5" }}
          labelStyle={{ color: "#a1a1aa", fontWeight: 600, marginBottom: "4px" }}
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
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            paddingBottom: "16px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        />

        <Bar
          dataKey="Receita"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          barSize={14}
        />
        <Bar
          dataKey="Despesa"
          fill="#f43f5e"
          radius={[4, 4, 0, 0]}
          barSize={14}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;

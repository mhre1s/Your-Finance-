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
        Receita: 0,
        Despesa: 0,
        _date: new Date(trans.date),
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

  data.sort((a, b) => a._date - b._date);

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

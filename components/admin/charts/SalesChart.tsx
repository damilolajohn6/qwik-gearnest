"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface SalesChartProps {
  data: Array<{
    _id: string;
    sales: number;
    orders: number;
  }>;
}

export default function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No sales data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item._id).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    sales: item.sales,
    orders: item.orders,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={5} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            formatter={(value, name) => [
              name === "sales" ? formatCurrency(value as number) : value,
              name === "sales" ? "Sales" : "Orders",
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ fill: "#4F46E5" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

interface StatsProps {
  stats: {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    paidOrders: number;
    recentOrders: number;
    totalRevenue: number;
    recentRevenue: number;
    averageOrderValue: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change:
        stats.recentRevenue > 0
          ? `+${formatCurrency(stats.recentRevenue)} this month`
          : "No recent sales",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.recentOrders} recent orders`,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: "Active products",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: "Registered users",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

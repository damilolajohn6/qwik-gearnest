/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardStats from "@/components/admin/DashboardStats";
import SalesChart from "@/components/admin/charts/SalesChart";
import OrdersChart from "@/components/admin/charts/OrdersChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

async function getDashboardStats() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/stats`;
    console.log("Fetching stats from:", url); // Log the URL for debugging
    
    // Get the token from cookies for server-side authentication
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Cookie': token ? `token=${token}` : '',
      },
    });

    if (!response.ok) {
      console.error(
        "Fetch failed with status:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to fetch stats: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Failed to load dashboard data</div>
          <p className="text-gray-500 mb-4">Please check your connection and try again</p>
          <Link 
            href="/admin/dashboard"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </Link>
        </div>
      </div>
    );
  }

  const { overview, salesTrend, orderStatusStats, topProducts } = stats;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats stats={overview} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersChart data={orderStatusStats} />
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((item: any, index: number) => (
              <div key={item._id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.totalSold} units sold
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.totalRevenue)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

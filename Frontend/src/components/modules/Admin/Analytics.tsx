import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllStatsQuery } from "@/redux/feature/Stats/stats.api";
import { Users, Book, Package, CheckCircle } from "lucide-react";

export default function Analytics() {
  const { data, isLoading, isError } = useGetAllStatsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading stats</div>;

  const stats = data?.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Orders */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-blue-500" />
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
        </CardContent>
      </Card>

      {/* Total Users */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Users className="w-6 h-6 text-green-500" />
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
        </CardContent>
      </Card>

      {/* Total Books */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Book className="w-6 h-6 text-purple-500" />
          <CardTitle>Total Books</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.totalBook || 0}</p>
        </CardContent>
      </Card>

      {/* Status Stats */}
      {stats?.statusStats?.map((status) => (
        <Card key={status.status}>
          <CardHeader className="flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-500" />
            <CardTitle>{status.status}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{status.count}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { paymentStatus } from "@/constants/order";
import { useGetAllStatsQuery } from "@/redux/feature/Stats/stats.api";
import {
  Users,
  Book,
  CheckCircle,
  Package,
  Truck,
  CalendarCheck,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";

export default function Analytics() {
  const { data, isLoading, isError } = useGetAllStatsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading stats</div>;

  const stats = data?.data;

  // Icon mapping for order status
  const statusIconMap: Record<string, React.ReactNode> = {
    Processing: <Clock className="w-6 h-6 text-yellow-500" />,
    Approved: <CheckCircle className="w-6 h-6 text-blue-500" />,
    Shipped: <Truck className="w-6 h-6 text-purple-500" />,
    Delivered: <CalendarCheck className="w-6 h-6 text-green-500" />,
    Cancelled: <XCircle className="w-6 h-6 text-red-500" />,
    Returned: <XCircle className="w-6 h-6 text-orange-500" />,
  };

  // Icon mapping for payment
  const paymentIconMap: Record<string, React.ReactNode> = {
    Paid: <DollarSign className="w-6 h-6 text-green-500" />,
    Pending: <DollarSign className="w-6 h-6 text-yellow-500" />,
    Cancelled: <DollarSign className="w-6 h-6 text-red-500" />,
  };

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

      {/* Revenue by Payment Status */}
      {stats?.revenue?.map((rev) => (
        <Card key={rev.status}>
          <CardHeader className="flex items-center gap-2">
            {paymentIconMap[rev.status] || (
              <DollarSign className="w-6 h-6 text-gray-500" />
            )}
            <CardTitle>{rev.status} Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">
              <span className="mr-2">
                {rev.status === paymentStatus.paid
                  ? "Total Revenue"
                  : "Total Amount"}  :
              </span>
              {rev.totalAmount} Tk.
            </p>
            <p className="text-2xl font-bold">Orders: {rev.count}</p>
          </CardContent>
        </Card>
      ))}

      {/* Status Stats */}
      {stats?.statusStats?.map((status) => (
        <Card key={status.status}>
          <CardHeader className="flex items-center gap-2">
            {statusIconMap[status.status] || (
              <Package className="w-6 h-6 text-gray-500" />
            )}
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

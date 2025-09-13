import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { role } from "@/constants/role";
import { useUserProfileQuery } from "@/redux/feature/Authentication/auth.api";

import type { IOrder } from "@/types";
import { format } from "date-fns";
import { Link } from "react-router";

interface Props {
  orders: IOrder[];

  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export default function OrderTable({ orders }: Props) {
  const { data: user } = useUserProfileQuery();
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 border">Date</TableHead>
            <TableHead className="p-2 border">Order ID</TableHead>
            <TableHead className="p-2 border">Status</TableHead>
            <TableHead className="p-2 border">Payment</TableHead>
            {(user?.data.role === role.admin ||
              user?.data.role === role.storeManager) && (
              <TableHead className="p-2 border">Payment Status</TableHead>
            )}
            <TableHead className="p-2 border">More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="p-2 border">
                {order?.orderStatusLog?.[0]?.timestamp
                  ? format(
                      new Date(order.orderStatusLog[0].timestamp),
                      "MMM dd, yyyy"
                    )
                  : "N/A"}
              </TableCell>
              <TableCell className="p-2 border">{order.orderId}</TableCell>
              <TableCell className="p-2 border">
                {order.currentStatus}
              </TableCell>
              <TableCell className="p-2 border">
                {order.paymentMethod}
              </TableCell>
              {(user?.data.role === role.admin ||
                user?.data.role === role.storeManager) && (
                <TableCell className="p-2 border">
                  {order.paymentStatus}
                </TableCell>
              )}
              <TableCell className="p-2 border">
                <Link
                  to={`/order-details/${order.orderId}`}
                  className="border hover:rounded border-blue-300 p-1 hover:bg-blue-300"
                >
                  ...
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

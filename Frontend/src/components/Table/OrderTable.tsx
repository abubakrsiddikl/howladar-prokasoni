import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { IOrder } from "@/types";

interface Props {
  orders: IOrder[];

  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export default function OrderTable({ orders }: Props) {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 border">Date</TableHead>
            <TableHead className="p-2 border">Order ID</TableHead>
            <TableHead className="p-2 border">Status</TableHead>
            <TableHead className="p-2 border">Payment</TableHead>
            <TableHead className="p-2 border">More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="p-2 border">
                {order?.orderStatusLogs[0].timestamp}
              </TableCell>
              <TableCell className="p-2 border">{order.orderId}</TableCell>
              <TableCell className="p-2 border">
                {order.currentStatus}
              </TableCell>
              <TableCell className="p-2 border">
                {order.paymentMethod}
              </TableCell>
              <TableCell className="p-2 border">...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

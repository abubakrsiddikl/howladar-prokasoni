import OrderTable from "@/components/Table/OrderTable";
import { useGetMyOrderQuery } from "@/redux/feature/Order/order.api";

export default function MyOrdersPage() {
  const { data: orders } = useGetMyOrderQuery(undefined);
  return (
    <div>
      <OrderTable orders={orders || []}></OrderTable>
    </div>
  );
}

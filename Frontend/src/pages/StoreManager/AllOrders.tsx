import OrderTable from "@/components/Table/OrderTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetAllOrderQuery } from "@/redux/feature/Order/order.api";

export default function AllOrders() {
  const { data: orders, isLoading } = useGetAllOrderQuery(undefined);
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div>
      <OrderTable orders={orders || []}></OrderTable>
    </div>
  );
}

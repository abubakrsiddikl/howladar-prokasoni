import { useParams } from "react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserProfileQuery } from "@/redux/feature/Authentication/auth.api";
import { useGetSingleOrderQuery } from "@/redux/feature/Order/order.api";
import { role } from "@/constants/role";
import OrderTimeline from "@/components/modules/Order/OrderTimeline";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function OrderDetails() {
  const { id } = useParams();
  const { data: user } = useUserProfileQuery(undefined);
  const {
    data: order,
    isLoading,
    isError,
  } = useGetSingleOrderQuery(id as string);

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError || !order)
    return (
      <p className="text-center text-red-500 mt-10">
        ❌ অর্ডার ডিটেইলস আনা যায়নি।
      </p>
    );
 console.log(order)
  // totals
  const subTotal =
    order.items?.reduce(
      (acc: number, item: any) => acc + item.quantity * item.book.price,
      0
    ) || 0;
  const deliveryCharge = 0;
  const discount = 0;
  const grandTotal = order.totalAmount || subTotal + deliveryCharge - discount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div
        className={`p-4 text-white font-semibold text-center rounded-lg ${
          order.currentStatus === "Delivered"
            ? "bg-green-600"
            : order.currentStatus === "Cancelled"
            ? "bg-red-600"
            : "bg-orange-500"
        }`}
      >
        This order has been {order.currentStatus.toLowerCase()}.
      </div>

      {/* Order Header */}
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold">Order: {order.orderId}</h1>
        <p className="text-sm text-gray-500">
          Placed: {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
        </p>
      </div>

      {/* Responsive Layout: left timeline, right summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <OrderTimeline order={order} />

        {/* Order Summary */}
        <div className="p-4 rounded-lg border bg-white">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="h-[200px] space-y-4 overflow-y-scroll">
            {order.items.map((item: any, idx: number) => (
              <div key={idx}>
                <div  className="flex items-center gap-4">
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    width={64}
                    height={80}
                    className="object-cover rounded"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.book.title}</p>
                    <p className="text-sm text-gray-600">
                      Price: Tk. {item.book.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold">
                    Tk. {(item.quantity * item.book.price).toLocaleString()}
                  </p>
                </div>
                 <div className="border-t border-dashed border-[#708dbf] my-4" />
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-right">
            <div className="flex justify-between">
              <span>Total items</span>
              <span>{order.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>Tk. {subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>Tk. {order.deliveryCharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>Tk. {discount}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Payable Amount</span>
              <span>Tk. {grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="p-4 rounded-lg border bg-white">
        <h2 className="text-lg font-bold mb-4">Shipping Info</h2>
        <p>🧑 {order.shippingInfo?.name}</p>
        <p>📧 {order.shippingInfo?.email}</p>
        <p>📞 {order.shippingInfo?.phone}</p>
        <p>
          📍 {order.shippingInfo?.address}, {order.shippingInfo?.city},
          District: {order.shippingInfo?.district},{" "}
          {order.shippingInfo?.division}
        </p>
      </div>

      {/* Payment Info */}
      <div className="p-4 rounded-lg border bg-white">
        <h2 className="text-lg font-bold mb-4">Payment Information</h2>
        <p>Selected Payment Method</p>
        <div className="bg-red-200 text-red-800 font-bold p-4 rounded-md text-center mt-2">
          {order.paymentMethod}
        </div>
      </div>

      {/* Status Update (Admin/Manager only) */}
      {(user?.data?.role === role.admin ||
        user?.data?.role === role.storeManager) && (
        <div className="p-4 rounded-lg border bg-white">
          <h2 className="text-lg font-bold mb-4">Update Order Status</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Select
              defaultValue={order.currentStatus}
              onValueChange={(v) => console.log("update:", v)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Update Status
            </Button>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <Button variant="outline">
          {order.currentStatus === "Cancelled"
            ? "Go Shopping"
            : "Download Invoice"}
        </Button>
      </div>
    </div>
  );
}

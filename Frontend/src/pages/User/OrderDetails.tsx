/* eslint-disable @typescript-eslint/no-explicit-any */

import { format } from "date-fns";
import { useParams } from "react-router";
import { useGetSingleOrderQuery } from "@/redux/feature/Order/order.api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserProfileQuery } from "@/redux/feature/Authentication/auth.api";

export default function OrderDetails() {
  const { id } = useParams();
  const { data: user } = useUserProfileQuery(undefined); 
  const {
    data: order,
    isLoading,
    isError,
  } = useGetSingleOrderQuery(id as string);

  //  Status Update Handler
  const handleStatusUpdate = (newStatus: string) => {
    console.log("Update to:", newStatus);
  };

  if (isLoading) {
    return <p className="text-center mt-10">লোড হচ্ছে...</p>;
  }

  if (isError || !order) {
    return (
      <p className="text-center text-red-500 mt-10">
        ❌ অর্ডার ডিটেইলস আনা যায়নি।
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* ✅ Order Header */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between">
          <div>
            <CardTitle>🆔 Order ID: {order.orderId}</CardTitle>
            <p className="text-sm text-gray-600">
              {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>
          <Button variant="outline">🧾 Download Invoice</Button>
        </CardHeader>
      </Card>

      {/* ✅ Shipping Info */}
      <Card>
        <CardHeader>
          <CardTitle>🚚 Shipping Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>👤 {order.shippingInfo?.name}</p>
          <p>📧 {order.shippingInfo?.email}</p>
          <p>📞 {order.shippingInfo?.phone}</p>
          <p>
            📍 {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
            {order.shippingInfo?.district}, {order.shippingInfo?.division}
          </p>
        </CardContent>
      </Card>

      {/* ✅ Items */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Ordered Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {order.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-4 border p-3 rounded-md"
              >
                <img
                  src={item.book.coverImage}
                  alt={item.book.title}
                  width={64}
                  height={80}
                  className="object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{item.book.title}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × ৳{item.book.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ✅ Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>💳 Payment & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Payment Method:</strong>{" "}
            {order.paymentMethod === "COD" && "Cash On Delivery"}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                order.paymentStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {order.paymentStatus}
            </span>
          </p>
          <p className="font-bold text-blue-600">মোট: ৳ {order.totalAmount}</p>
        </CardContent>
      </Card>

      {/* ✅ Admin/Store Manager Status Update */}
      {(user?.role === "admin" || user?.role === "store-manager") && (
        <Card>
          <CardHeader>
            <CardTitle>🔄 Update Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select
                onValueChange={handleStatusUpdate}
                defaultValue={order.orderStatus}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

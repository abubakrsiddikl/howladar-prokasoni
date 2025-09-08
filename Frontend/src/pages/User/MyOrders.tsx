import OrderTable from "@/components/Table/OrderTable";
import { useGetMyOrderQuery } from "@/redux/feature/Order/order.api";


export default function MyOrdersPage() {
  const { data: orders } = useGetMyOrderQuery(undefined);
  console.log(orders);
  return (
    // <div className="max-w-6xl mx-auto px-4 py-6">
    //   <h1 className="text-3xl font-bold mb-6">📦 আমার অর্ডার সমূহ</h1>

    //   {orders?.length === 0 ? (
    //     <p className="text-gray-600">আপনার কোনো অর্ডার নেই।</p>
    //   ) : (
    //     <div className="space-y-6">
    //       {orders?.map((order) => (
    //         <div
    //           key={order._id}
    //           className="border rounded-lg p-4 shadow hover:shadow-lg transition"
    //         >
    //           <div className="flex justify-between items-center mb-3">
    //             <div>
    //               <p className="font-semibold">🆔 Order ID: {order.orderId}</p>
    //               <p className="text-sm text-gray-500">
    //                 {new Date(order.createdAt).toLocaleString()}
    //               </p>
    //             </div>
    //             <div>
    //               <span
    //                 className={`px-3 py-1 rounded-full text-sm ${
    //                   order.orderStatus === "Processing"
    //                     ? "bg-yellow-100 text-yellow-800"
    //                     : order.orderStatus === "Delivered"
    //                     ? "bg-green-100 text-green-800"
    //                     : "bg-red-100 text-red-800"
    //                 }`}
    //               >
    //                 {order.orderStatus}
    //               </span>
    //             </div>
    //           </div>

    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             {order.items.map((item, index) => (
    //               <div
    //                 key={index}
    //                 className="flex items-center gap-4 border p-3 rounded"
    //               >
    //                 <img
    //                   src={item.book.coverImage}
    //                   alt={item.book.title}
    //                   width={64}
    //                   height={80}
    //                   className=" object-cover rounded"
    //                 />
    //                 <div>
    //                   <p className="font-medium">{item.book.title}</p>
    //                   <p className="text-sm text-gray-600">
    //                     Quantity: {item.quantity}
    //                   </p>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>

    //           <div className="flex justify-between items-center mt-4">
    //             <p className="font-bold text-blue-600">
    //               মোট: ৳ {order.totalAmount}
    //             </p>
    //             <p
    //               className={`text-sm ${
    //                 order.paymentStatus === "Paid"
    //                   ? "text-green-600"
    //                   : "text-red-600"
    //               }`}
    //             >
    //               {order.paymentStatus === "Paid"
    //                 ? "পেমেন্ট সম্পন্ন"
    //                 : "পেমেন্ট বাকি"}
    //             </p>
    //             <Link to={`/orderdetails/${order.orderId}`}>Details</Link>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </div>
    <OrderTable orders={orders || []} ></OrderTable>
  );
}

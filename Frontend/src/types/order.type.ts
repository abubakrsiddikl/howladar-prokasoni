// export interface IOrder {
//   _id: string;
//   orderId: string;
//   totalAmount: number;
//   orderStatus: string;
//   paymentStatus: string;
//   createdAt: string;
//   items: {
//     book: {
//       title: string;
//       coverImage: string;
//     };
//     quantity: number;
//   }[];
// }
export interface IOrderItem {
  book: {
    title: string;
    coverImage: string;
    price: string
  };
  quantity: number;
}

export interface IShippingInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
  division: string;
  district: string;
  city: string;
}

export type IPaymentMethod = "COD" | "SSLCommerz";

export interface IOrder {
  _id: string;
  user: string;
  items: IOrderItem[];
  shippingInfo: IShippingInfo;
  paymentMethod: IPaymentMethod;
  paymentStatus: "Paid" | "Pending";
  totalAmount: number;
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  orderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderStats {
  totalOrders: number;
  delivered: number;
  processing: number;
  shipped: number;
  cancelled: number;
}

import dayjs from "dayjs";
import { Order } from "../module/order/order.model";

export const generateOrderId = async () => {
  const today = dayjs().format("YYYYMMDD"); // 20250813
  const orderCount = (await Order.countDocuments()) + 1;
  const paddedNumber =  String(orderCount).padStart(4, "0"); // 0001
  return `ORD-${today}-${paddedNumber}`;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

import { IOrder } from "../module/order/order.interface";
import { IUser, Role } from "../module/user/user.interface";
import { User } from "../module/user/user.model";
import { generateOrderInvoicePDF } from "./invoice";

import { sendEmail } from "./sendEmail";

interface OrderEmailPayload {
  order: IOrder;
  user?: Partial<IUser>;
  shippingInfo: {
    address: string;
    phone: string;
    city: string;
    district: string;
    division: string;
  };
}

export const sendOrderEmails = async ({
  order,
  user,
  shippingInfo,
}: OrderEmailPayload) => {
  // 1. Admin + Manager emails
  const adminsAndStoreManagers = await User.find({
    role: { $in: [Role.ADMIN, Role.STORE_MANAGER] },
  });
  // console.log("order from sendOrderEmail",order)

  const emails = adminsAndStoreManagers.map((admin) => admin.email);
  const pdfBuffer = await generateOrderInvoicePDF(order);

  // 2. Send admin email
  await sendEmail({
    to: emails.join(", "),
    subject: "New Order Created",
    templateName: "adminOrderEmail",
    templateData: {
      orderId: order?.orderId,
      orderType: order?.orderType,
      customerName: user?.name,
      total: order?.totalAmount,
      phone: shippingInfo.phone || user?.phone,
      paymentMethod: order?.paymentMethod,
      paymentStatus: order?.paymentStatus,
      shippingAddress: shippingInfo?.address,
      city: shippingInfo?.city,
      district: shippingInfo?.district,
      division: shippingInfo?.division,
    },
    attachments: [
      {
        filename: `Invoice_${order.orderId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
  // console.log("after send email admin")

  // 3. Send customer email
  if (user && user.email) {
    await sendEmail({
      to: user.email,
      subject: "Order Confirmation",
      templateName: "customerOrderEmail",
      templateData: {
        orderId: order.orderId,
        customerName: user.name,
        total: order.totalAmount,
        phone: shippingInfo.phone || user.phone,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingAddress: shippingInfo.address,
        city: shippingInfo.city,
        district: shippingInfo.district,
        division: shippingInfo.division,
      },
      attachments: [
        {
          filename: `Invoice_${order.orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  }
  console.log("after send email customer")
  
};

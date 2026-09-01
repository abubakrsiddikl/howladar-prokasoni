/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "./order.model";
import {
  IOrder,
  IOrderStatusLog,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from "./order.interface";
import { Book } from "../book/book.model";
import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";
import { generateOrderId } from "../../utils/generateOrderId";
import { User } from "../user/user.model";
import { orderSearchableFields } from "./order.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sendOrderEmails } from "../../utils/sendOrderEmail";
import { generateSecureTransactionId } from "../../utils/generateTransactionId";
import { saveInvoiceURLToDB } from "../../utils/invoiceUrlSaveToDB";
import { Campaign } from "../campaign/campaign.model";
import { sendEmail } from "../../utils/sendEmail";
import { generateOrderInvoicePDF } from "../../utils/invoice";

// const createRegularOrder = async (
//   payload: IOrder,
//   decodedToken?: JwtPayload,
// ) => {
//   // console.log(decodedToken,"decodedToken")
//   const session = await Book.startSession();

//   // Check order type and handle accordingly
//   if (payload.orderType === OrderType.CAMPAIGN) {
//     try {
//       session.startTransaction();

//       // Campaign order only supports COD
//       if (payload.paymentMethod !== PaymentMethod.COD) {
//         throw new AppError(
//           httpStatus.BAD_REQUEST,
//           "Campaign orders only support Cash on Delivery.",
//         );
//       }

//       if (!payload.campaignId) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Campaign ID is required");
//       }

//       const campaign = await Campaign.findOne({
//         _id: payload.campaignId,
//         isActive: true,
//       }).session(session);

//       if (!campaign) {
//         throw new AppError(
//           httpStatus.NOT_FOUND,
//           "Campaign not found or inactive",
//         );
//       }

//       const deliveryCharge =
//         payload.shippingInfo.district === "ঢাকা" ? 60 : 120;

//       const totalAmount = campaign.campaignPrice + deliveryCharge;

//       const initialOrderStatusLog: IOrderStatusLog = {
//         status: OrderStatus.Processing,
//         location: "N/A",
//         note: "ক্যাম্পেইন অর্ডারটি গ্রহণ করা হয়েছে।",
//         timestamp: new Date(),
//       };

//       const orderData = {
//         user: undefined,

//         orderType: OrderType.CAMPAIGN,

//         items: [],

//         campaignId: campaign._id,

//         shippingInfo: payload.shippingInfo,

//         paymentMethod: PaymentMethod.COD,

//         paymentStatus: PaymentStatus.PENDING,

//         totalAmount,

//         deliveryCharge,

//         totalDiscountedPrice: 0,

//         orderStatusLog: [initialOrderStatusLog],

//         currentStatus: OrderStatus.Processing,

//         orderId: await generateOrderId(),
//       };

//       const [order] = await Order.create([orderData], { session });

//       await session.commitTransaction();

//       return order;
//     } catch (error: any) {
//       if (session.inTransaction()) {
//         await session.abortTransaction();
//       }

//       throw error;
//     } finally {
//       await session.endSession();
//     }
//   }

//   // check regular order
//   if (payload.orderType === OrderType.REGULAR) {
//     try {
//       session.startTransaction();
//       if (!decodedToken) {
//         throw new AppError(
//           httpStatus.UNAUTHORIZED,
//           "You must be logged in to place an order.",
//         );
//       }
//       // if (decodedToken && decodedToken.role !== Role.CUSTOMER) {
//       //   throw new AppError(
//       //     httpStatus.FORBIDDEN,
//       //     "Only customers can place orders!",
//       //   );
//       // }

//       let totalAmount = 0;

//       // Validate each book & calculate total
//       for (const item of payload.items) {
//         const book = await Book.findById(item.book).session(session);

//         if (!book) {
//           throw new AppError(
//             httpStatus.NOT_FOUND,
//             `Book not found: ${item.book}`,
//           );
//         }

//         // Stock check
//         if (book.stock < item.quantity) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             `Not enough stock for book: ${book.title}`,
//           );
//         }

//         // Add to total
//         totalAmount += book.price * item.quantity;
//       }

//       const initialOrderStatusLog: IOrderStatusLog = {
//         status: OrderStatus.Processing,
//         location: "N/A",
//         note: "অর্ডারটি গ্রহণ করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
//         timestamp: new Date(),
//       };
//       // delivery charge include of totalAmount
//       const deliveryCharge =
//         payload.shippingInfo.district === "ঢাকা" ? 60 : 120;

//       const subTotal = totalAmount + deliveryCharge;
//       const totalDiscountedPrice = payload.items.reduce(
//         (sum: number, item: any) =>
//           sum + (item.book.discountedPrice || 0) * item.quantity,

//         0,
//       );

//       // Prepare order data
//       const orderData = {
//         ...payload,
//         user: decodedToken ? decodedToken.userId : undefined,
//         totalAmount: subTotal,
//         orderStatusLog: [initialOrderStatusLog],
//         orderId: await generateOrderId(),
//         deliveryCharge: deliveryCharge,
//         totalDiscountedPrice: totalDiscountedPrice,
//       };

//       // * SSLCommerz payment initiate
//       if (orderData.paymentMethod === "SSLCommerz") {
//         // generate tranId
//         const transactionId = generateSecureTransactionId(20);
//         // 1. ssl payment data
//         const sslPayload: ISSLCommerz = {
//           orderId: orderData.orderId,
//           amount: orderData.totalAmount,
//           transactionId: transactionId,
//           name: payload.shippingInfo.name,
//           email: payload.shippingInfo.email,
//           phoneNumber: payload.shippingInfo.phone,
//           address: payload.shippingInfo.address,
//         };

//         // 2. SSL initiate
//         const sslResponse = await SSLService.sslPaymentInit(sslPayload);
//         // console.log("ssl initiate res", sslResponse);
//         //  check ssl res
//         if (sslResponse.status === "SUCCESS") {
//           orderData.transactionId = sslPayload.transactionId;

//           // 4. crete order
//           const [order] = await Order.create([orderData], { session });
//           // update stock
//           for (const item of payload.items) {
//             await Book.findByIdAndUpdate(
//               item.book,
//               { $inc: { stock: -item.quantity } },
//               { session },
//             );
//           }
//           await session.commitTransaction();
//           return {
//             order,
//             paymentUrl: sslResponse.GatewayPageURL,
//           };
//         } else {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             "Failed to initiate SSLCommerz payment.",
//           );
//         }
//       }

//       //* Create order within transaction and cod
//       const [order] = await Order.create([orderData], { session });

//       // Update stock after order creation
//       for (const item of payload.items) {
//         await Book.findByIdAndUpdate(
//           item.book,
//           { $inc: { stock: -item.quantity } },
//           { session },
//         );
//       }

//       // populate order to use send email pdf attachment
//       const populateOrder = await Order.findById(order._id)
//         .populate("items.book")
//         .session(session);
//       if (!populateOrder) {
//         throw new AppError(
//           httpStatus.NOT_FOUND,
//           "Order could not be populated",
//         );
//       }
//       // invoice pdf generate and upload and save url to db
//       // console.log("This is a consol")
//       await saveInvoiceURLToDB(order._id.toString(), session);
//       await session.commitTransaction();
//       const user = await User.findById(
//         decodedToken ? decodedToken.userId : undefined,
//         "-password",
//       ).session(session);
//       // console.log(user,"user")
//       if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found");
//       }
//       await sendOrderEmails({
//         order: populateOrder as IOrder,
//         user: user,
//         shippingInfo: order.shippingInfo,
//       });
//       return order;
//     } catch (error: any) {
//       if (session.inTransaction()) {
//         await session.abortTransaction();
//       }
//       // await session.abortTransaction();
//       throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
//     } finally {
//       session.endSession();
//     }
//   }
// };

const createRegularOrder = async (
  payload: IOrder,
  decodedToken: JwtPayload,
) => {
  if (payload.orderType !== OrderType.REGULAR) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid order type for regular order.",
    );
  }
  const session = await Book.startSession();

  try {
    session.startTransaction();
    if (decodedToken.role !== Role.CUSTOMER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only customers can place orders!",
      );
    }

    let totalAmount = 0;

    // Validate each book & calculate total
    for (const item of payload.items) {
      const book = await Book.findById(item.book).session(session);

      if (!book) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Book not found: ${item.book}`,
        );
      }

      // Stock check
      if (book.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Not enough stock for book: ${book.title}`,
        );
      }

      // Add to total
      totalAmount += book.price * item.quantity;
    }

    const initialOrderStatusLog: IOrderStatusLog = {
      status: OrderStatus.Processing,
      location: "N/A",
      note: "অর্ডারটি গ্রহণ করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
      timestamp: new Date(),
    };
    // delivery charge include of totalAmount
    const deliveryCharge = payload.shippingInfo.district === "ঢাকা" ? 60 : 120;

    const subTotal = totalAmount + deliveryCharge;
    const totalDiscountedPrice = payload.items.reduce(
      (sum: number, item: any) =>
        sum + (item.book.discountedPrice || 0) * item.quantity,

      0,
    );

    // Prepare order data
    const orderData = {
      ...payload,
      user: decodedToken.userId,
      totalAmount: subTotal,
      orderType: OrderType.REGULAR,
      orderStatusLog: [initialOrderStatusLog],
      orderId: await generateOrderId(),
      deliveryCharge: deliveryCharge,
      totalDiscountedPrice: totalDiscountedPrice,
    };

    // * SSLCommerz payment initiate
    if (orderData.paymentMethod === "SSLCommerz") {
      // generate tranId
      const transactionId = generateSecureTransactionId(20);
      // 1. ssl payment data
      const sslPayload: ISSLCommerz = {
        orderId: orderData.orderId,
        amount: orderData.totalAmount,
        transactionId: transactionId,
        name: payload.shippingInfo.name,
        email: payload.shippingInfo.email,
        phoneNumber: payload.shippingInfo.phone,
        address: payload.shippingInfo.address,
      };

      // 2. SSL initiate
      const sslResponse = await SSLService.sslPaymentInit(sslPayload);
      // console.log("ssl initiate res", sslResponse);
      //  check ssl res
      if (sslResponse.status === "SUCCESS") {
        orderData.transactionId = sslPayload.transactionId;

        // 4. crete order
        const [order] = await Order.create([orderData], { session });
        // update stock
        for (const item of payload.items) {
          await Book.findByIdAndUpdate(
            item.book,
            { $inc: { stock: -item.quantity } },
            { session },
          );
        }
        await session.commitTransaction();
        return {
          order,
          paymentUrl: sslResponse.GatewayPageURL,
        };
      } else {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Failed to initiate SSLCommerz payment.",
        );
      }
    }

    //* Create order within transaction and cod
    const [order] = await Order.create([orderData], { session });

    // Update stock after order creation
    for (const item of payload.items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { stock: -item.quantity } },
        { session },
      );
    }

    // populate order to use send email pdf attachment
    const populateOrder = await Order.findById(order._id)
      .populate("items.book")
      .session(session);
    if (!populateOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Order could not be populated");
    }
    // invoice pdf generate and upload and save url to db
    await saveInvoiceURLToDB(order._id.toString(), session);
    await session.commitTransaction();
    const user = await User.findById(decodedToken.userId, "-password").session(
      session,
    );
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    await sendOrderEmails({
      order: populateOrder as IOrder,
      user: user,
      shippingInfo: order.shippingInfo,
    });
    return order;
  } catch (error: any) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    // await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  } finally {
    session.endSession();
  }
};

// create campaign order
const createCampaignOrder = async (payload: IOrder) => {
  if (payload.orderType !== OrderType.CAMPAIGN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid order type for campaign order.",
    );
  }
  const session = await Book.startSession();
  try {
    session.startTransaction();

    // Campaign order only supports COD
    if (payload.paymentMethod !== PaymentMethod.COD) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Campaign orders only support Cash on Delivery.",
      );
    }

    if (!payload.campaignId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Campaign ID is required");
    }

    const campaign = await Campaign.findOne({
      _id: payload.campaignId,
      isActive: true,
    }).session(session);

    if (!campaign) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Campaign not found or inactive",
      );
    }

    let deliveryCharge = 0;

    if (campaign.isDeliveryFree) {
      deliveryCharge = 0;
    } else {
      deliveryCharge = payload.shippingInfo.district === "ঢাকা" ? 60 : 120;
    }
    // const deliveryCharge = payload.shippingInfo.district === "ঢাকা" ? 60 : 120;

    const totalAmount = campaign.campaignPrice + deliveryCharge;

    const initialOrderStatusLog: IOrderStatusLog = {
      status: OrderStatus.Processing,
      location: "N/A",
      note: "ক্যাম্পেইন অর্ডারটি গ্রহণ করা হয়েছে।",
      timestamp: new Date(),
    };

    const orderData = {
      user: undefined,

      orderType: OrderType.CAMPAIGN,

      items: [],

      campaignId: campaign._id,

      shippingInfo: payload.shippingInfo,

      paymentMethod: PaymentMethod.COD,

      paymentStatus: PaymentStatus.PENDING,

      totalAmount,

      deliveryCharge,

      totalDiscountedPrice: 0,

      orderStatusLog: [initialOrderStatusLog],

      currentStatus: OrderStatus.Processing,

      orderId: await generateOrderId(),
    };

    const [order] = await Order.create([orderData], { session });

    // console.log(order,"order")
    // const populatedOrder = await Order.findById(order._id).populate(
    //   "campaignId",
    // );
    // console.log(populatedOrder,"populatedOrder")

    // if (!populatedOrder) {
    //   throw new AppError(
    //     httpStatus.NOT_FOUND,
    //     "Order not found after creation",
    //   );
    // }

    const populatedOrder = await Order.findById(order._id)
      .populate("campaignId")
      .session(session);

    if (!populatedOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Order could not be populated");
    }
    // console.log("saveinvoice db before")
    await saveInvoiceURLToDB(order._id.toString(), session);

    // console.log("before send email");
    // await sendOrderEmails({
    //   order: populatedOrder as IOrder,
    //   shippingInfo: order.shippingInfo,
    // });
    // 2. Send admin email
    // 1. Admin + Manager emails
    const adminsAndStoreManagers = await User.find({
      role: { $in: [Role.ADMIN, Role.STORE_MANAGER] },
    });
    const emails = adminsAndStoreManagers.map((admin) => admin.email);
    const pdfBuffer = await generateOrderInvoicePDF(populatedOrder as IOrder);
    console.log("send email before");
    await sendEmail({
      to: emails.join(", "),
      subject: "New Order Created",
      templateName: "adminOrderEmail",
      templateData: {
        orderId: order?.orderId,
        orderType: order?.orderType,
        customerName: order?.shippingInfo.name,
        total: order?.totalAmount,
        phone: order?.shippingInfo.phone,
        paymentMethod: order?.paymentMethod,
        paymentStatus: order?.paymentStatus,
        shippingAddress: order.shippingInfo?.address,
        city: order.shippingInfo?.city,
        district: order.shippingInfo?.district,
        division: order.shippingInfo?.division,
      },
      attachments: [
        {
          filename: `Invoice_${order.orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    console.log("after send email");

    await session.commitTransaction();

    return order;
  } catch (error: any) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

// get order by customer id
const getMyOrders = async (decodedToken: JwtPayload) => {
  const orders = await Order.find({ user: decodedToken?.userId })
    .sort("-createdAt")
    .populate("items.book", "title coverImage");
  return orders;
};

// get all order
const getAllOrders = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Order.find(), query);

  await queryBuilder.filter();
  queryBuilder.search(orderSearchableFields).sort().paginate();

  const [data, meta] = await Promise.all([
    queryBuilder
      .build()
      .populate("user", "-password")
      .populate("items.book")
      .populate("campaignId"),
    queryBuilder.getMeta(),
  ]);
  // console.log(data)

  return { data, meta };
};

const getTraceOrder = async (orderId: string) => {
  const orderInfo = await Order.findOne({ orderId }).select(
    "orderStatusLog createdAt -_id",
  );
  if (!orderInfo) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "এই অর্ডার আইডি তে কোনো অর্ডার পাওয়া যায় নি দয়া সঠিক অর্ডার আইডি দিন ",
    );
  }
  return orderInfo;
};
const getSingleOrder = async (orderId: string) => {
  return await Order.findOne({ orderId })
    .populate("user")
    .populate("items.book")
    .populate("campaignId");
};

// Update order status
// Allowed status transitions
const allowedStatusFlow: Record<OrderStatus, OrderStatus[]> = {
  Processing: [OrderStatus.Approved, OrderStatus.Cancelled],
  Approved: [OrderStatus.Shipped, OrderStatus.Cancelled],
  Shipped: [OrderStatus.Delivered],
  Delivered: [OrderStatus.Returned],
  Cancelled: [],
  Failed: [],
  Returned: [],
};

// Status এর note
const statusNotes: Record<OrderStatus, string> = {
  Processing: "অর্ডারটি গ্রহণ করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
  Approved: "অর্ডারটি প্রস্তুত করা হচ্ছে",
  Shipped: "অর্ডারটি কুরিয়ারের কাছে দেয়া হয়েছে",
  Delivered: "অর্ডারটি ডেলিভারি দেয়া হয়েছে",
  Cancelled: "অর্ডারটি বাতিল করা হয়েছে",
  Failed: "",
  Returned: "অর্ডারটি কাস্টমার দ্বারা ফেরত দেয়া হয়েছে",
};

// Update order status function
const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "অর্ডারটি পাওয়া যায়নি");
  }

  if (order.currentStatus === newStatus) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `অর্ডারের স্ট্যাটাস ইতিমধ্যেই ${newStatus}`,
    );
  }

  // Check duplicate in log
  const isDuplicate = order.orderStatusLog.some(
    (item) => item.status === newStatus,
  );
  if (isDuplicate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `অর্ডারের স্ট্যাটাস ইতিমধ্যেই ${newStatus}`,
    );
  }

  // Check allowed status flow
  const allowedNextStatus =
    allowedStatusFlow[order.currentStatus as OrderStatus];
  if (!allowedNextStatus.includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `অর্ডারের স্ট্যাটাস ${order.currentStatus} থেকে ${newStatus} সম্ভব নয়`,
    );
  }

  // Update status & add note
  order.currentStatus = newStatus;
  if (newStatus === OrderStatus.Delivered) {
    order.paymentStatus = PaymentStatus.PAID;
  }

  // update order status is Cancelled to update  payment status by Cancelled

  if (
    newStatus === OrderStatus.Cancelled ||
    newStatus === OrderStatus.Returned
  ) {
    order.paymentStatus = PaymentStatus.CANCELLED;
  }

  order.orderStatusLog.push({
    status: newStatus,
    note: statusNotes[newStatus],
    timestamp: new Date(),
  });

  await order.save();
  return order;
};

// Update payment status
const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus: paymentStatus },
    { new: true, runValidators: true },
  );
  return updatedOrder;
};

// delete orders
const deleteOrder = async (id: string) => {
  return await Order.findByIdAndDelete(id);
};

export const OrderService = {
  createRegularOrder,
  createCampaignOrder,
  getMyOrders,
  getTraceOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
};

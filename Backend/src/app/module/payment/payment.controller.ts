import { Request, Response } from "express";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";

import { PaymentService } from "./payment.service";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { sendResponse } from "../../utils/sendResponse";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}/${query.orderId}?transactionId=${query.tran_id}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  // * not hit my cancel api check cancel
  if (query.status === "cancel" || query.status === "CANCELLED") {
    const cancelResult = await PaymentService.cancelPayment(
      query as Record<string, string>
    );

    if (!cancelResult.success) {
      return res.redirect(
        `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${cancelResult.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
  const failResult = await PaymentService.failPayment(
    query as Record<string, string>
  );

  if (!failResult.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${failResult.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  );

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});


// validate payment
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  console.log("sslcommerz ipn url body", req.body);
  await SSLService.validatePayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Validated Successfully",
    data: null,
  });
});

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  validatePayment,
};

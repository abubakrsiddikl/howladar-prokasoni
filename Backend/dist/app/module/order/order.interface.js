"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.PaymentStatus = exports.PaymentMethod = void 0;
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
    PaymentMethod["SSLCommerz"] = "SSLCommerz";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Paid"] = "Paid";
    PaymentStatus["Pending"] = "Pending";
    PaymentStatus["Cancelled"] = "Cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Processing"] = "Processing";
    OrderStatus["Approved"] = "Approved";
    OrderStatus["Shipped"] = "Shipped";
    OrderStatus["Delivered"] = "Delivered";
    OrderStatus["Cancelled"] = "Cancelled";
    OrderStatus["Returned"] = "Returned";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));

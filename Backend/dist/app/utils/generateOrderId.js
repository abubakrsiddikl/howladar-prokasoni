"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const order_model_1 = require("../module/order/order.model");
const generateOrderId = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, dayjs_1.default)().format("YYYYMMDD"); // 20250813
    const orderCount = (yield order_model_1.Order.countDocuments()) + 1;
    const paddedNumber = String(orderCount).padStart(4, "0"); // 0001
    return `ORD-${today}-${paddedNumber}`;
});
exports.generateOrderId = generateOrderId;

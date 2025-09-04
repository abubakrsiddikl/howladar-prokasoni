import OrderSummary from "@/components/modules/Checkout/OrderSummary";
import PaymentMethod from "@/components/modules/Checkout/PaymentMethod";
import ShippingForm from "@/components/modules/Checkout/ShippingForm";
import { useCart } from "@/hooks/useCart";
import { useUserProfileQuery } from "@/redux/feature/Authentication/auth.api";
import { useCreateOrderMutation } from "@/redux/feature/Order/order.api";
import type { CartItem } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [createOrder] = useCreateOrderMutation();
  const { cart, clearCart } = useCart();
  const { data: user } = useUserProfileQuery(undefined);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );
  const onlineFee = paymentMethod === "SSLCommerz" ? 50 : 80;
  const total = subtotal + onlineFee;

  const handlePlaceOrder = async (shippingInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    division: string;
    district: string;
    city: string;
  }) => {
    setLoading(true);
    try {
      const payload = {
        items: cart.map((item: Partial<CartItem>) => ({
          book: item.book?._id,
          quantity: item.quantity,
        })),
        shippingInfo,
        paymentMethod,
      };

      const res = await createOrder(payload).unwrap();
      console.log(res);
      if (res.success) {
        toast.success("🎉 Your order has been saved successfully");
        clearCart();
        console.log(res.data?.orderId);
        navigate(`/ordersuccess/${res.data?.orderId}`);
      }
      //   work later for payment gateway
      //   if (paymentMethod === "SSLCommerz" && res.data.paymentUrl) {
      //     router.push(res.data.paymentUrl);
      //   }
      else {
        clearCart();
        navigate(`/ordersuccess/${res.data.data?.orderId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ অর্ডার করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <ShippingForm
          onSubmit={handlePlaceOrder}
          loading={loading}
          disabled={cart.length === 0}
          totalAmount={total}
          defaultValues={{
            name: user?.name || "",
            email: user?.email || "",
            phone: "",
            address: "",
            division: "",
            district: "",
            city: "",
          }}
        />
        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </div>

      <OrderSummary subtotal={subtotal} onlineFee={onlineFee} total={total} />
    </div>
  );
}

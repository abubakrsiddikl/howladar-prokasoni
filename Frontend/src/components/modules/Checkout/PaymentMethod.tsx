import type { IPaymentMethod } from "@/types";

export default function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
}: {
  paymentMethod: IPaymentMethod;
  setPaymentMethod: (method: IPaymentMethod) => void;
}) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          ক্যাশ অন ডেলিভারি
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={paymentMethod === "SSLCommerz"}
            onChange={() => {
              alert("Coming Soon ");
              setPaymentMethod("COD"); 
            }}
          />
          SSLCommerz (Card / Mobile Wallet)
        </label>
      </div>
    </div>
  );
}

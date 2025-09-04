
export default function OrderSummary({
  subtotal,
  onlineFee,
  total,
}: {
  subtotal: number;
  onlineFee: number;
  total: number;
}) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Checkout Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>৳ {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Online Fee</span>
          <span>৳ {onlineFee}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>৳ {total}</span>
        </div>
      </div>

      {/* <button
        onClick={handlePlaceOrder}
        disabled={disabled || loading}
        className={`w-full bg-blue-600 text-white py-3 rounded mt-5 ${
          loading ? "opacity-50" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button> */}
    </div>
  );
}

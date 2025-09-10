export default function OrderSummary({
  subtotal,
  deliveryCharge,
  total,
}: {
  subtotal: number;
  deliveryCharge: number;
  total: number;
}) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Checkout Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span> {subtotal} Tk.</span>
        </div>
        <div className="flex justify-between">
          <span>Discount </span>
          <span>
            0 Tk.
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charge</span>
          <span>{deliveryCharge} Tk.</span>
        </div>
        <div className="border-t border-dashed pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>{total} Tk.</span>
        </div>
      </div>
    </div>
  );
}

import CartItemCard from "@/components/modules/Cart/CartItemCard";
import { useCart } from "@/hooks/useCart";

import { Link } from "react-router";

export default function CartPage() {
  const { cart, clearCart } = useCart();

  const total = cart.reduce(
    (sum: number, item) => sum + item.book.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty 😢</h2>
        <Link
          to="/"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">🛒 Your Cart</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-300">
              <th className="text-left p-4">Details</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Total</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <CartItemCard key={item._id || item.book._id} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 border-t pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xl font-semibold">
          Cart Total = <span className="text-blue-700">৳ {total}</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
          <Link
            to="/checkout"
            className="bg-amber-400 text-black px-5 py-2 rounded hover:bg-amber-500"
          >
            Shipping & Payment
          </Link>
        </div>
      </div>
    </div>
  );
}

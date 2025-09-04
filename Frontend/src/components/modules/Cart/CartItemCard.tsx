import { useCart } from "@/hooks/useCart";
import type { ICartItemResponse } from "@/types";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export default function CartItemCard({ item }: { item: ICartItemResponse }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <tr className="border-b ">
      {/* Details */}
      <td className="flex items-center gap-4 p-4">
        <img
          src={item.book.coverImage}
          alt={item.book.title}
          width={60}
          height={80}
          className="object-contain border rounded"
        />
        <div>
          <h3 className="font-semibold text-[#1a0dab] hover:underline">
            {item.book.title}
          </h3>
          <p className="text-sm text-gray-500">N/A</p>
          <p className="text-sm text-gray-500">
            Unit price: Tk. {item.book.price}
          </p>
        </div>
      </td>

      {/* Quantity */}
      <td className="text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() =>
              item.quantity > 1 &&
              updateQuantity(item._id || item.book._id, item.quantity - 1)
            }
            className="border px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
          >
            <FaMinus size={12} />
          </button>
          <span className="min-w-[20px] text-center">{item.quantity}</span>
          <button
            onClick={() =>
              updateQuantity(item._id || item.book._id, item.quantity + 1)
            }
            className="border px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
          >
            <FaPlus size={12} />
          </button>
        </div>
      </td>

      {/* Total */}
      <td className="text-center font-semibold">
        Tk. {item.book.price * item.quantity}
      </td>

      {/* Action */}
      <td className="text-center">
        <button
          onClick={() => removeFromCart(item._id || item.book._id)}
          className="text-red-500 hover:text-red-700 cursor-pointer"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

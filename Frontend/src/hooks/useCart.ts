import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLocal,
  removeLocal,
  updateLocal,
  clearLocal,
} from "@/redux/feature/Cart/cart.slice";
import {
  useGetMyCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useClearCartMutation,
} from "@/redux/feature/Cart/cart.api";
import type { RootState } from "@/redux/store";
import type { CartItem } from "@/types";
import { useUserProfileQuery } from "@/redux/feature/Authentication/auth.api";
import { toast } from "sonner";

export function useCart() {
  const { data: user } = useUserProfileQuery(undefined);
  const dispatch = useDispatch();

  // server cart
  const {
    data: serverCart = [],
    isFetching,
    refetch,
  } = useGetMyCartQuery(undefined, {
    skip: !user,
  });
  const [addToCartServer] = useAddToCartMutation();
  const [removeFromCartServer] = useRemoveFromCartMutation();
  const [updateQtyServer] = useUpdateCartQuantityMutation();
  const [clearCartServer] = useClearCartMutation();

  // guest cart
  const guestCart = useSelector((s: RootState) => s.guestCart.items);

  // 🔥 Merge localCart → serverCart যখন user login করে
  useEffect(() => {
    const syncGuestCart = async () => {
      if (user && guestCart.length > 0) {
        for (const item of guestCart) {
          await addToCartServer({
            bookId: item.book._id,
            quantity: item.quantity,
          });
        }
        // Local cart clear করা
        dispatch(clearLocal());
        // server cart fresh data আনতে
        refetch();
      }
    };
    syncGuestCart();
  }, [user]);

  // final cart (depending on login)
  const cart = user ? serverCart : guestCart;

  // wrapper methods
  const addToCart = async (item: CartItem) => {
    if (user) {
      const res = await addToCartServer({
        bookId: item.book._id as string,
        quantity: item.quantity,
      });
     if (res.data?.success) {
      toast.success("Item added to cart .")
     }
    } else {
      dispatch(addLocal(item));
    }
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      await removeFromCartServer(id);
    } else {
      dispatch(removeLocal(id));
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (user) {
      await updateQtyServer({ id, quantity });
    } else {
      dispatch(updateLocal({ id, quantity }));
    }
  };

  const clearCart = async () => {
    if (user) {
      await clearCartServer();
    } else {
      dispatch(clearLocal());
    }
  };

  return {
    cart,
    isFetching,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}

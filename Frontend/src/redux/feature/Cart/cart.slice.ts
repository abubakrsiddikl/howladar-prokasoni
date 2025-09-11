import type { ICartItem } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

type CartState = { items: ICartItem[] };

const LS_KEY = "cart";

const loadFromLS = (): ICartItem[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToLS = (items: ICartItem[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch (error) {
    console.log(error);
  }
};

const initialState: CartState = { items: loadFromLS() };

const cartSlice = createSlice({
  name: "guestCart",
  initialState,
  reducers: {
    addLocal: (state, action: PayloadAction<ICartItem>) => {
      const item = action.payload;
      const exist = state.items.find((i) => i.book._id === item.book._id);
      if (exist) {
        exist.quantity += item.quantity;
      } else {
        state.items.push(item);
         toast.success("Item added to cart .")
      }
      saveToLS(state.items);
    },
    removeLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.book._id !== action.payload);
      saveToLS(state.items);
    },
    updateLocal: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      state.items = state.items.map((i) =>
        i.book._id === id ? { ...i, quantity } : i
      );
      saveToLS(state.items);
    },
    clearLocal: (state) => {
      state.items = [];
      saveToLS(state.items);
    },
    setLocalFromServer: (state, action: PayloadAction<ICartItem[]>) => {
      // server cart reflect করতে চাইলে (optional)
      state.items = action.payload;
      saveToLS(state.items);
    },
  },
});

export const {
  addLocal,
  removeLocal,
  updateLocal,
  clearLocal,
  setLocalFromServer,
} = cartSlice.actions;

export default cartSlice.reducer;

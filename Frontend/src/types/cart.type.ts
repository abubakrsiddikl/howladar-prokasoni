export interface CartItem {
  _id?: string;
  book: {
    _id: string;
    title: string;
    coverImage: string;
    price: number;
  };
  quantity: number;
}

export interface ICartItem {
  _id?: string;
  book: {
    _id: string;
    title: string;
    coverImage: string;
    price: number;
  };
  quantity: number;
}

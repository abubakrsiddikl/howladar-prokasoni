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

export interface ICartItemResponse {
  _id?: string;
  book: {
    _id: string;
    title: string;
    coverImage: string;
    price: number;
  };
  quantity: number;
}

export interface CartItem {
  _id?: string;
  book: {
    _id: string;
    title: string;
    coverImage: string;
    price: number;
    discountedPrice: number;
    discount: number;
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
    discountedPrice?: number;
    discount?: number;
    slug?: string;
  };
  quantity: number;
}

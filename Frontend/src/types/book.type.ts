export interface IBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  genre: string;
  discount: number;
  discountedPrice: number;
  description: string;
  coverImage: string;
  previewImages: string[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

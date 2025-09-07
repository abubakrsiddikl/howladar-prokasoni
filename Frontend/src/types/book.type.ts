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

export const Genre = {
  UPONNAS: "উপন্যাস",
  GOLPO: "গল্প",
  ISLAMIC: "ইসলামিক",
  BIGGYAN: "বিজ্ঞান",
  ITIHASH: "ইতিহাস",
  JIBONI: "জীবনী",
  FANTASY: "ফ্যান্টাসি",
  PROJUKTI: "প্রযুক্তি",
} as const;

export type Genre = (typeof Genre)[keyof typeof Genre];

//  new book create type

export interface IBookCreate {
  title: string;
  author: string;
  price: number;
  stock: number;
  genre: Genre;
  discount: number;
  description: string;
  coverImage?: string;
  previewImages?: string[];
}

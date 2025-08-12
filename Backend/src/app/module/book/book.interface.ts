export enum Genre {
  UPONNAS = "উপন্যাস",
  GOLPO = "গল্প",
  ISLAMIC = "ইসলামিক",
  BIGGYAN = "বিজ্ঞান",
  ITIHASH = "ইতিহাস",
  JIBONI = "জীবনী",
  FANTASY = "ফ্যান্টাসি",
  PROJUKTI = "প্রযুক্তি",
}

export interface IBook {
  title: string;
  slug: string;
  author: string;
  price: number;
  stock: number;
  genre: Genre;
  discount: number;
  description?: string;
  coverImage: string;
  available: boolean;
}

export interface IBookFilterOptions {
  search?: string;
  genre?: Genre;
  page?: number;
  limit?: number;
}

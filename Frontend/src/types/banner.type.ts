export interface IBanner {
  _id?: string;
  title: string;
  image: string;
  link?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBannerCreatePayload {
  title: string;
  image: File | string;
  link?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export interface IBannerUpdatePayload extends Partial<IBannerCreatePayload> {
  _id?: string;
}

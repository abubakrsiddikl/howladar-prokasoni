import { Types } from "mongoose";

export interface ICampaign {
  _id?: Types.ObjectId;

  title: string;
  slug: string;
  bannerImage: string;
  description: string;

  campaignPrice: number;
  // deliveryCharge: number;
  isDeliveryFree: boolean;

  isActive: boolean;

  startDate?: Date;
  endDate?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

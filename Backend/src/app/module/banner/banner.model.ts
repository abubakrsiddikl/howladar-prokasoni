import { Schema, model } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    link: { type: String },
    active: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true } 
);

export const Banner = model<IBanner>("Banner", bannerSchema);

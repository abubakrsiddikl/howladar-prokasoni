import { Schema, model } from "mongoose";
import { ICampaign } from "./campaign.interface";

const campaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: false, unique: true },
    bannerImage: { type: String, required: true },
    description: { type: String, required: true, trim: true }, //book details
    campaignPrice: { type: Number, required: true }, 
    isDeliveryFree: { type: Boolean, default: false },
    // deliveryCharge: { type: Number, default: 60 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// create slug
campaignSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Campaign.exists({ slug })) {
      slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
    }

    this.slug = slug;
  }
  next();
});
campaignSchema.pre("findOneAndUpdate", async function (next) {
  const campaign = this.getUpdate() as Partial<ICampaign>;

  if (campaign.title) {
    const baseSlug = campaign.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Campaign.exists({ slug })) {
      slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
    }

    campaign.slug = slug;
  }

  this.setUpdate(campaign);

  next();
});

export const Campaign = model<ICampaign>("Campaign", campaignSchema);

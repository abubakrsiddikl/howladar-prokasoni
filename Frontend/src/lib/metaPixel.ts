import ReactPixel from "react-facebook-pixel";

export const initPixel = () => {
  ReactPixel.init(import.meta.env.VITE_FACEBOOK_PIXEL_ID || "");
  ReactPixel.pageView();
};

export const metaPixelTrackEvent = (event: string, data?: object) => {
  ReactPixel.trackCustom(event, data);
};

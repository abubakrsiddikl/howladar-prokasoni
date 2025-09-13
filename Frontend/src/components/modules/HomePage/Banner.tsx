import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetAllActiveBannerQuery } from "@/redux/feature/Banner/banner.api";

import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router";

export default function Banner() {
  const { data: banners, isLoading } = useGetAllActiveBannerQuery();

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return (
    <div className="my-5">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper w-11/12 mx-auto max-w-6xl"
      >
        {banners?.data.map((banner) => (
          <SwiperSlide>
            <Link to={banner.link ? banner.link : "/"}>
              <img
                src={banner.image}
                className="w-full h-[194px] md:h-[300px] rounded-md"
                alt={banner.title}
              />
            </Link>
          </SwiperSlide>
        ))}

        <button className="custom-prev absolute top-1/2  z-10 -translate-y-1/2 bg-white shadow-md hover:bg-gray-200 text-black p-2 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <button className="custom-next absolute top-1/2 -right-0 z-10 -translate-y-1/2 bg-white shadow-md hover:bg-gray-200 text-black p-2 rounded-full">
          <ChevronRight size={20} />
        </button>
      </Swiper>
    </div>
  );
}


import type { IBook } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import BookCard from "../BookCard";

export function GenreSwiper({ books }: { books: IBook[] }) {
  return (
    <div className="relative group">
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        loop
        spaceBetween={10}
        breakpoints={{
          0: { slidesPerView: 2 }, // Mobile
          500:{slidesPerView: 3},
          768: { slidesPerView: 4 }, // md
          1024: { slidesPerView: 4 }, // lg
        }}
      >
        {books.map((book) => (
          <SwiperSlide key={book._id}>
            <BookCard {...book} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition">
        &#10094;
      </button>
      <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition">
        &#10095;
      </button>
    </div>
  );
}
import { Card, CardContent } from "@/components/ui/card";

import { useGetAllBookQuery } from "@/redux/feature/Book/book.api";
import BookCard from "../Book/BookCard";
import type { IBook } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function GenreWiseBooks() {
  const { data, isLoading } = useGetAllBookQuery(undefined);

  if (isLoading) return <p>Loading...</p>;

  const books = data?.data || [];
  const groupedBooks = books.reduce((acc: Record<string, IBook[]>, book) => {
    if (!acc[book.genre]) acc[book.genre] = [];
    acc[book.genre].push(book);
    return acc;
  }, {});

  return (
    <div className="space-y-10 w-11/12 mx-auto">
      {Object.keys(groupedBooks).map((genre) => (
        <Card key={genre} className="relative">
          <CardContent className="space-y-4">
            {/* Genre Title */}
            <h2 className="text-2xl font-bold">{genre}</h2>

            {/* Carousel inside Genre Card */}
            <GenreSwiper books={groupedBooks[genre]} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GenreSwiper({ books }: { books: IBook[] }) {
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
          768: { slidesPerView: 4 }, // md
          1024: { slidesPerView: 6 }, // lg
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

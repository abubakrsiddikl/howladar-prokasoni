import { Card, CardContent } from "@/components/ui/card";
import { useGetBookByGenreQuery } from "@/redux/feature/Book/book.api";
import type { IGenre } from "@/types";
import { GenreSwiper } from "./GenreSwiper";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Link } from "react-router";
export function GenreSection({ genre }: { genre: IGenre }) {
  const { data, isLoading } = useGetBookByGenreQuery({
    genre: genre.name,
    limit: 10,
  });

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  const books = data?.data || [];

  if (books.length === 0) return null;
  return (
    <Card className="relative border border-[#ff8600] shadow-none">
      <CardContent className="space-y-4">
        {/* Genre Title */}
        <div className="flex justify-between">
          <div className="flex justify-center gap-3">
            <h2 className="text-xl font-bold text-[#25517a]">
              {genre.name} বই কিনুন
            </h2>
            <p className="text-base mt-2 font-semibold text-[#25517a]">
              ({genre.description})
            </p>
          </div>

          <Link to={`/more-books/${genre.name}`} className="text-[#ff8600]">
            See all {">"}
          </Link>
        </div>

        {/* Carousel inside Genre Card */}
        <GenreSwiper books={books} />
      </CardContent>
    </Card>
  );
}

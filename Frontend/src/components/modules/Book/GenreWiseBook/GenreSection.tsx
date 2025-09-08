import { Card, CardContent } from "@/components/ui/card";
import { useGetBookByGenreQuery } from "@/redux/feature/Book/book.api";
import type { IGenre } from "@/types";
import { GenreSwiper } from "./GenreSwiper";
export function GenreSection({ genre }: { genre: IGenre }) {
 
  const { data, isLoading } = useGetBookByGenreQuery({
    genre: genre.name,
    limit: 10,
  });
  

  if (isLoading) return <p>Loading {genre.name}...</p>;

  const books = data?.data || [];

  if (books.length === 0) return null;
console.log(genre)
  return (
    <Card className="relative">
      <CardContent className="space-y-4">
        {/* Genre Title */}
        <h2 className="text-2xl font-bold">{genre.name}</h2>

        {/* Carousel inside Genre Card */}
        <GenreSwiper books={books} />
      </CardContent>
    </Card>
  );
}
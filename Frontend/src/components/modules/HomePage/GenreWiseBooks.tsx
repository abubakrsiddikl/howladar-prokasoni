import { useGetAllGenresQuery } from "@/redux/feature/Genre/genre.api";
import type { IGenre } from "@/types";
import "swiper/css";
import "swiper/css/navigation";
import { GenreSection } from "../Book/GenreWiseBook/GenreSection";

export default function GenreWiseBooks() {
  const { data: genreRes, isLoading: genreLoading } =
    useGetAllGenresQuery(undefined);

  if (genreLoading) return <p>Loading genres...</p>;

  const genres: IGenre[] = genreRes?.data || [];

  return (
    <div className="space-y-10 w-11/12 mx-auto">
      {genres.map((genre) => (
        <GenreSection key={genre._id} genre={genre} />
      ))}
    </div>
  );
}

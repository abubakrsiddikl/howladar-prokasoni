import { useGetBookByGenreQuery } from "@/redux/feature/Book/book.api";
import BookCard from "../Book/BookCard";
import type { IBook } from "@/types";

export default function HistoryBook() {
  const { data } = useGetBookByGenreQuery("উপন্যাস");
  console.log(data?.data);
  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.data.map((book: IBook, idx: string) => (
        <BookCard key={idx} {...book}></BookCard>
      ))}
    </div>
  );
}

// import { useGetBookByGenreQuery } from "@/redux/feature/Book/book.api";
import { useGetAllBookQuery } from "@/redux/feature/Book/book.api";
import BookCard from "../Book/BookCard";

export default function HistoryBook() {
  // const { data, isLoading } = useGetBookByGenreQuery("উপন্যাস");
  const { data, isLoading } = useGetAllBookQuery(undefined);
  if (isLoading) {
    return <p>Loading </p>;
  }
  const books = data?.data || [];
  console.log(books);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {books.map((book, idx) => (
        <BookCard key={idx} {...book}></BookCard>
      ))}
    </div>
  );
}

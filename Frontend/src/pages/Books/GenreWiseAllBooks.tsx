import BookCard from "@/components/modules/Book/BookCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetBookByGenreQuery } from "@/redux/feature/Book/book.api";
import { useState } from "react";
import { useParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function GenreWiseAllBooks() {
  const { genre } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);
  const { data: books, isLoading } = useGetBookByGenreQuery({
    genre: genre as string,
    page: currentPage,
    limit: limit,
  });

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  const totalPage = books?.meta?.totalPage || 1;

  return (
    <div className=" w-11/12 mx-auto max-w-6xl my-6 ">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {books?.data.map((book) => (
          <BookCard {...book} key={book._id}></BookCard>
        ))}
      </div>
      {totalPage > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prv) => prv - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem className="flex">
                {Array.from({ length: totalPage }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem
                      key={page}
                      onClick={() => setCurrentPage(page)}
                    >
                      <PaginationLink isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prv) => prv + 1)}
                  className={
                    currentPage === totalPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

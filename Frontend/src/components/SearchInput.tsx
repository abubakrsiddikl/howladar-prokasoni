import { useState } from "react";
import { useGetAllBookQuery } from "@/redux/feature/Book/book.api";
import type { IBook } from "@/types";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAllBookQuery(
    { searchTerm: search },
    {
      skip: !search,
    }
  );
  console.log(data?.data?.data);

  const books: Partial<IBook>[] = data?.data?.data || [];

  return (
    <div className="relative w-11/12 mx-auto bg-white ">
      {/*  Shadcn Input */}
      <Input
        type="text"
        placeholder="🔍 খুঁজুন বইয়ের নাম, লেখক বা genre"
        className="w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <div className="absolute z-50 bg-white border w-full mt-1 rounded-md shadow-2xl max-h-[400px] overflow-y-auto">
          {/*  লোডিং অবস্থায় skeleton দেখানো */}
          {isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-2/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : books.length > 0 ? (
            books.map((book) => (
              <Link
                key={book._id}
                to={`/bookdetails/${book._id}`}
                className="flex gap-3 items-center px-4 py-2 hover:bg-blue-50 transition-colors"
              >
                <div className="w-12 h-16 relative flex-shrink-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{book.title}</h3>
                  <p className="text-xs text-gray-600">{book.author}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-gray-600">😔 কোনো বই পাওয়া যায়নি।</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;

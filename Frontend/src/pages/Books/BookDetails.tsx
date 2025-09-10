"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetBookByGenreQuery,
  useGetSingleBookQuery,
} from "@/redux/feature/Book/book.api";
import { useParams } from "react-router";
import { useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BookCard from "@/components/modules/Book/BookCard";
import PreviewGalleryDialog from "@/components/modules/Book/PreviewGalleryDialog";

export default function BookDetails() {
  const { slug } = useParams();
  const [open, setOpen] = useState(false);

  const { data: singleBook, isLoading } = useGetSingleBookQuery(slug as string);
  const book = singleBook?.data;

  const { data: similarBook, isLoading: simLoading } = useGetBookByGenreQuery({
    genre: book?.genre.name as string,
    limit: 8,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!book) return <p className="text-center py-10">❌ Book not found</p>;

  // previewImages gallery setup
  const galleryItems =
    book.previewImages?.map((img) => ({
      original: img,
      thumbnail: img,
    })) || [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Book Main Section */}
      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Book Cover */}
          <div className="relative col-span-1">
            <img
              src={book.coverImage}
              alt={book.title}
              className="p-3 w-full h-[400px] object-cover rounded-lg cursor-pointer "
              onClick={() => setOpen(true)}
            />
          </div>

          {/* Book Info */}
          <CardContent className="col-span-2 flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {book.title}
                </CardTitle>
              </CardHeader>

              <p className="text-gray-600 mb-2">
                by{" "}
                <span className="font-medium text-blue-400">{book.author}</span>
              </p>

              {book.description && (
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {book.description}
                </p>
              )}

              {/* Price & Discount */}
              <div className="flex items-center gap-3 mb-4">
                {book.discount ? (
                  <>
                    <span className="text-2xl font-bold text-green-600">
                      {book.price}৳
                    </span>
                    <span className="line-through text-gray-500">
                      {book.price + book.discountedPrice}৳
                    </span>
                    <span className="text-[#ff8600] text-sm font-medium">
                      Your Save Tk.{book.discountedPrice}({book.discount}%)
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-green-600">
                    {book.price}৳
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button className="flex-1">🛒 Add to Cart</Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(true)}
              >
                📖 একটু পড়ে দেখুন
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Preview Modal */}
      <PreviewGalleryDialog
        open={open}
        setOpen={setOpen}
        title={book.title}
        galleryItems={galleryItems}
      />

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📚 Similar Books</h2>
        {simLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarBook?.data?.map((similar) => (
              <BookCard key={similar._id} {...similar} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

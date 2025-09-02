import { Button } from "@/components/ui/button";
import type { IBook } from "@/types";
import { Link } from "react-router";

export default function BookCard({
  title,
  author,
  price,
  coverImage,
  discount,
  discountedPrice,
}: IBook) {
  return (
    <div>
      <div className="bg-white shadow-md hover:shadow-2xl transition-shadow duration-300 rounded-lg">
        {/* image wrapper */}
        <div className="relative w-full h-64">
          <img
            src={coverImage}
            alt={title}
            className="pt-1 px-1 md:px-2 md:pt-2 w-full h-full object-contain"
          />

          {/* discount sticker */}
          {discount && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-2  rounded-full shadow-lg -tracking-wider">
              {discount}%
              <br /> OFF
            </div>
          )}
        </div>

        {/* card info */}
        <div className="py-2 pl-7">
          <Link to="/">
            <h3 className="text-sm font-semibold hover:text-[#FF8600] line-clamp-1 mt-3">
              {title}
            </h3>
          </Link>

          <p className="text-gray-500 text-sm line-clamp-1">by {author}</p>

          {/* price section */}
          <div className="flex items-center gap-2 mt-1">
            {discount > 0 ? (
              <>
                {/* product original price */}
                <p className="text-gray-400 line-through text-sm">
                  ৳ {price + discountedPrice}
                </p>
                {/* product discounted total price */}
                <p className="text-[#FF8600] font-semibold text-                xl">
                  ৳ {price}
                </p>
              </>
            ) : (
              <p className="text-[#FF8600] font-semibold text-xl">৳ {price}</p>
            )}
          </div>
        </div>

        <div className="px-2 pb-4">
          <Button className="w-full p-1 md:px-4 md:py-1 rounded-lg text-lg flex justify-center items-center gap-2 transition ">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

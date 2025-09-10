import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import type { IBook, ICartItem } from "@/types";
import { Link } from "react-router";

export default function BookCard({
  _id,
  title,
  author,
  price,
  coverImage,
  discount,
  discountedPrice,
  stock,
  slug,
}: IBook) {
  const { addToCart } = useCart();
  const handleAddToCart = async () => {
    const cartItem: ICartItem = {
      book: { _id, title, coverImage, price },
      quantity: 1,
    };
    await addToCart(cartItem);
  };

  return (
    <div>
      <div className="bg-white  hover:shadow-2xl transition-shadow duration-300 rounded-lg flex flex-col border  md:hover:border-[#ff8600] sm:border-[#ff8600]">
        {/* image wrapper */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80">
          <img
            src={coverImage}
            alt={title}
            className="pt-1 px-1 sm:px-2 sm:pt-2 w-full h-full object-contain"
          />

          {/* discount sticker */}
          {discount > 0 && (
            <div className="absolute top-2 left-3 bg-red-600 text-white text-xs sm:text-sm md:text-sm font-bold px-2 rounded-full shadow-lg tracking-wider">
              {discount}%<br /> OFF
            </div>
          )}
        </div>

        {/* card info */}
        <div className="py-2 pl-3 sm:pl-4 md:pl-6">
          <Link to={`/book-details/${slug}`}>
            <h3 className="text-sm sm:text-base md:text-base lg:text-lg font-semibold hover:text-[#FF8600] line-clamp-1 mt-2">
              {title}
            </h3>
          </Link>

          <p className="text-gray-500 text-xs sm:text-sm md:text-sm lg:text-base line-clamp-1">
            by {author}
          </p>

          {/* price section */}
          <div className="flex items-center gap-2 mt-1">
            {discount > 0 ? (
              <>
                <p className="text-gray-400 line-through text-xs sm:text-sm md:text-sm lg:text-base">
                  ৳ {price + discountedPrice}
                </p>
                <p className="text-[#FF8600] font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
                  ৳ {price}
                </p>
              </>
            ) : (
              <p className="text-[#FF8600] font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
                ৳ {price}
              </p>
            )}
          </div>
        </div>

        {/* add to cart button */}
        <div className="px-2 pb-3 sm:pb-4 mt-auto">
          {stock <= 0 ? (
            <Button className="w-full p-2 sm:p-3 md:p-3 rounded-lg text-sm sm:text-base md:text-base flex justify-center items-center gap-2 cursor-not-allowed">
              Out of Stock
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-full p-2 sm:p-3 md:p-3 rounded-lg text-sm sm:text-base md:text-base flex justify-center items-center gap-2"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

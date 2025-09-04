import { Menu, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  authApi,
  useLogoutMutation,
  useUserProfileQuery,
} from "@/redux/feature/Authentication/auth.api";
import { useDispatch } from "react-redux";
import { useCart } from "@/hooks/useCart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { data: user } = useUserProfileQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const { cart } = useCart();

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };

  //  NavLink Generator
  const navLink = (href: string, label: string) => (
    <Link
      to={href}
      className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-[#FF8600]"
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-[#727088] shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/*  Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-white flex items-center gap-2"
        >
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
            className="max-h-8 dark:invert"
            alt="logo"
          />
          <span>হাওলাদার প্রকাশনী</span>
        </Link>

        {/*  Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {navLink("/", "হোম")}
          {navLink("#", "উপন্যাস")}
          {navLink("#", "গল্প")}
          {navLink("#", "বিজ্ঞান")}
          {navLink("#", "ইতিহাস")}
          {navLink("#", "জীবনী")}
          {navLink("#", "ফ্যান্টাসি")}
          {navLink("#", "প্রযুক্তি")}

          {/* Auth Buttons */}
          {user?.data?.email ? (
            <>
            <Button
              onClick={handleLogout}
              className="bg-white text-gray-700 hover:bg-gray-200"
            >
              লগআউট
            </Button>
            
            </>
          ) : (
            <Button
              asChild
              className="bg-white text-gray-700 hover:bg-gray-200"
            >
              <Link to="/auth/login">লগইন</Link>
            </Button>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center px-3 py-2 rounded-md hover:underline"
          >
            <ShoppingCart className="h-7 w-7 text-white" />
            {cart?.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#ff8600] text-white text-xs px-1.5 rounded-full font-bold">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* ✅ Mobile Menu Drawer */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 bg-[#727088]">
              <SheetHeader>
                <Link
                  to="/"
                  className="text-lg font-bold text-white flex items-center gap-2"
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                    className="max-h-6 dark:invert"
                    alt="logo"
                  />
                  <span>হাওলাদার প্রকাশনী</span>
                </Link>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-2">
                {navLink("/", "হোম")}
                {navLink("#", "উপন্যাস")}
                {navLink("#", "গল্প")}
                {navLink("#", "বিজ্ঞান")}
                {navLink("#", "ইতিহাস")}
                {navLink("#", "জীবনী")}
                {navLink("#", "ফ্যান্টাসি")}
                {navLink("#", "প্রযুক্তি")}

                {user?.data?.email ? (
                  <Button
                    onClick={handleLogout}
                    className="bg-white text-gray-700 hover:bg-gray-200"
                  >
                    লগআউট
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="bg-white text-gray-700 hover:bg-gray-200"
                  >
                    <Link to="/auth/login">লগইন</Link>
                  </Button>
                )}

                {/* ✅ Cart */}
                <Link
                  to="/cart"
                  className="relative flex items-center px-3 py-2 rounded-md hover:bg-gray-200"
                >
                  <ShoppingCart className="h-5 w-5 text-white" />
                  {cart?.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                  <span className="ml-2 text-white">Cart</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };

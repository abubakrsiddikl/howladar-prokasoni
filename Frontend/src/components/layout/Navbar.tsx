import { Menu, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useUserProfileQuery } from "@/redux/feature/Authentication/auth.api";

import { useCart } from "@/hooks/useCart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { role } from "@/constants/role";
import SearchInput from "../SearchInput";

const Navbar = () => {
  const { data: user } = useUserProfileQuery(undefined);

  const { cart } = useCart();
  // dashboard link generator
  const dashboardLink = () => {
    if (user?.data?.role === role.admin) {
      return navLink("/admin", "Dashboard");
    }
    if (user?.data?.role === role.customer) {
      return navLink("/user", "Dashboard");
    }
    if (user?.data?.role === role.storeManager) {
      return navLink("/store-manager", "Dashboard");
    }
    return null;
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
    <div>
      {/* order track  */}
      <div className="bg-[#ff8600] text-white py-3">
        <div className="  w-11/12 mx-auto w-max-6xl flex justify-evenly">
          <div className="flex gap-4">
            <p>+8801936582963</p>
            <p>
              কোন বই খুজে না পেলে অনুগ্রহ করে ফোন করুন অথবা হোয়াটসঅ্যাপে মেসেজ
              করুন
            </p>
          </div>
          <Link to="order-track" className="font-bold"> অর্ডার ট্র্যাক করুন </Link>
        </div>
      </div>

      {/* this navbar */}
      <nav className="bg-[#727088] shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Drawer Icon and Logo */}
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-5 w-5" />
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
                  </div>
                </SheetContent>
              </Sheet>
              <Link
                to="/"
                className="text-xl font-bold text-white flex items-center gap-2"
              >
                <img
                  src="/logo.jpg"
                  className="h-[36px] w-[36px] dark:invert rounded"
                  alt="logo"
                />
              </Link>
            </div>

            {/* Center: SearchInput (Desktop only) */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <SearchInput />
            </div>

            {/* Right: Dashboard Button and Cart Icon */}
            <div className="flex items-center gap-2">
              {user?.data?.email ? (
                <>{dashboardLink()}</>
              ) : (
                <Button
                  asChild
                  className="bg-white text-gray-700 hover:bg-gray-200"
                >
                  <Link to="/auth/login">লগইন</Link>
                </Button>
              )}
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
          </div>

          {/* Mobile: SearchInput on second line */}
          <div className="md:hidden mt-3">
            <SearchInput />
          </div>
        </div>
      </nav>
    </div>
  );
};

export { Navbar };

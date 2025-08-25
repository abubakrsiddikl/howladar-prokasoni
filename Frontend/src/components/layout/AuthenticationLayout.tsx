import { cn } from "@/lib/utils";
import { NavLink, Outlet } from "react-router";

export default function AuthenticationLayout() {
  return (
    <div className="container mx-auto border rounded-2xl py-10">
      <div className="flex justify-center items-center gap-10 text-center">
        <NavLink
          to="/auth/login"
          className={({ isActive }) =>
            cn("text-2xl font-light", isActive ? "text-[#ff8600]" : "text-black")
          }
        >
          Login
        </NavLink>
        <NavLink
          to="/auth/register"
          className={({ isActive }) =>
            cn("text-2xl font-light", isActive ? "text-[#ff8600]" : "text-black")
          }
        >
          Register
        </NavLink>
      </div>
      <Outlet></Outlet>
    </div>
  );
}

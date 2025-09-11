import { useUserProfileQuery } from "@/redux/feature/Authentication/auth.api";
import { type TRole } from "@/types";
import { type ComponentType } from "react";
import { Navigate, useLocation } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const location = useLocation();
    const { data, isLoading } = useUserProfileQuery(undefined);

    if (isLoading) {
      return <div>Loading...</div>; // অথবা spinner ব্যবহার করুন
    }

    if (!data?.data?.email) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (requiredRole && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component />;
  };
};

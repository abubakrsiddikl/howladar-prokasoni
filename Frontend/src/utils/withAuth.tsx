import { useUserProfileQuery } from "@/redux/feature/Authentication/auth.api";
import { type TRole } from "@/types";
import { type ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserProfileQuery(undefined);
    if (!isLoading && !data?.data?.email) {
      return <Navigate to="/auth/login"></Navigate>;
    }
    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized"></Navigate>;
    }
    console.log("inside withAuth", data);
    return <Component></Component>;
  };
};

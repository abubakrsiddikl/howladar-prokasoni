import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  authApi,
  useLogoutMutation,
} from "@/redux/feature/Authentication/auth.api";

export default function Logout() {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout(undefined).unwrap();
        dispatch(authApi.util.resetApiState());
        navigate("/"); 
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    handleLogout();
  }, [logout, dispatch, navigate]);

  return<></>; 
}

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  authApi,
  useLogoutMutation,
} from "@/redux/feature/Authentication/auth.api";
import { sendErrorMessageToUser } from "@/utils/sendErrorMessageToUser";

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
        sendErrorMessageToUser(error);
      }
    };

    handleLogout();
  }, [logout, dispatch, navigate]);

  return <></>;
}

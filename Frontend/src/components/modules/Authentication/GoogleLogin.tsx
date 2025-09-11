import { Button } from "@/components/ui/button";
import config from "@/config/env";
import { FcGoogle } from "react-icons/fc";
import { useLocation } from "react-router";

export default function GoogleLogin() {
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";
 
  return (
    <div>
      <Button
        onClick={() =>
          (window.location.href = `${config.baseUrl}/auth/google?redirect=${from}`)
        }
        type="button"
        variant="outline"
        className="w-full cursor-pointer bg-black text-white"
      >
        <FcGoogle className="text-2xl" /> Login with Google
      </Button>
    </div>
  );
}

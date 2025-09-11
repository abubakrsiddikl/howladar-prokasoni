import { Button } from "@/components/ui/button";
import config from "@/config/env";
import { useAnalytics } from "@/hooks/useAnalytics";
import { FcGoogle } from "react-icons/fc";
import { useLocation } from "react-router";

export default function GoogleLogin() {
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";
  const { trackEvent } = useAnalytics();
  const handleGoogleLogin = () => {
    trackEvent("login", { method: "google" });
    window.location.href = `${config.baseUrl}/auth/google?redirect=${from}`;
  };
  return (
    <div>
      <Button
        onClick={handleGoogleLogin}
        type="button"
        variant="outline"
        className="w-full cursor-pointer bg-black text-white"
      >
        <FcGoogle className="text-2xl" /> Login with Google
      </Button>
    </div>
  );
}

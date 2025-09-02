import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLogin() {
  return (
    <div>
      <Button
        onClick={() => window.open(`http://localhost:5000/api/v1/auth/google`)}
        type="button"
        variant="outline"
        className="w-full cursor-pointer bg-black text-white"
      >
        <FcGoogle className="text-2xl"></FcGoogle> Login with Google
      </Button>
    </div>
  );
}

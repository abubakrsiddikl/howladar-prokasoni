import Password from "@/components/Password";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";

import { toast } from "sonner";
import GoogleLogin from "./GoogleLogin";
import { useLoginMutation } from "@/redux/feature/Authentication/auth.api";
// import { role } from "@/constants/role";
import { useNavigate } from "react-router";

export default function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const form = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await login(data).unwrap();
      console.log(res.data?.user?.role);
      if (res.success) {
        // if (res.data?.user?.role === role.admin) {
        //   navigate("/admin/analytics", { replace: true });
        // } else if (res.data?.user?.role === role.customer) {
        //   navigate("/user", { replace: true });
        // } else {
        //   navigate("/", { replace: true });
        // }
        navigate("/")
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);

      if (err.data.message === "Password does not match") {
        toast.error("Invalid credentials");
      }
    }
  };

  return (
    <div
      className={cn("container mx-auto flex flex-col py-5 px-3 ", className)}
      {...props}
    >
      <div className="grid gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Password {...field}></Password>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <GoogleLogin></GoogleLogin>
      </div>
    </div>
  );
}

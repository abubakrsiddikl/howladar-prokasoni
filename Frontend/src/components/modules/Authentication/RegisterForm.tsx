/* eslint-disable @typescript-eslint/no-explicit-any */
import Password from "@/components/Password";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import GoogleLogin from "./GoogleLogin";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegisterMutation } from "@/redux/feature/Authentication/auth.api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { sendErrorMessageToUser } from "@/utils/sendErrorMessageToUser";

export default function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const registerSchema = z
    .object({
      name: z
        .string()
        .min(1, { message: "Name is required" })
        .min(3, { message: "Name is too short" })
        .max(50, { message: "Name is too long" }),

      email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
      phone: z
        .string()
        .min(1, "Phone number is required")
        .max(14, "Phone is to long"),

      password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),

      confirmPassword: z
        .string()
        .min(1, { message: "Confirm Password is required" })
        .min(8, { message: "Confirm Password must be at least 8 characters" }),

      terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = "submitting...";
    try {
      const res = await register(data).unwrap();
      if (res.success) {
        toast.success("Register successfully", { id: toastId });
        navigate("/auth/login");
      }
    } catch (error) {
      sendErrorMessageToUser(error);
    }
  };

  return (
    <div
      className={cn("container mx-auto flex flex-col py-5 px-3", className)}
      {...props}
    >
      <div className="grid gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@company.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex:01744466612"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Password {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Password {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    ></Checkbox>
                  </FormControl>
                  <FormLabel>Accepted Terms And Conditions ? </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
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

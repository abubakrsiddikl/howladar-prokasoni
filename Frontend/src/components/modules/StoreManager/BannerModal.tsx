import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import SingleImageUploader from "@/components/SingleImageUploader";

import type { IBannerCreatePayload, IBannerUpdatePayload } from "@/types";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/redux/feature/Banner/banner.api";

interface BannerModalProps {
  bannerData?: IBannerUpdatePayload;
  onSuccess?: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().optional(),
  active: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  image: z.any(),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

export default function BannerModal({
  bannerData,
  open,
  setOpen,
  onSuccess,
}: BannerModalProps) {
  const [image, setImage] = useState<File | string | null>(null);
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: bannerData?.title || "",
      link: bannerData?.link || "",
      active: bannerData?.active ?? true,
      startDate: bannerData?.startDate || "",
      endDate: bannerData?.endDate || "",
      image: bannerData?.image || null,
    },
  });

  useEffect(() => {
    if (bannerData?.image) setImage(bannerData.image);
  }, [bannerData]);

  const handleSubmit = async (data: BannerFormValues) => {
    try {
      const payload = bannerData
        ? ({ ...data, id: bannerData._id } as IBannerUpdatePayload)
        : (data as IBannerCreatePayload);

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (image && image instanceof File) formData.append("file", image);

      const res = bannerData
        ? await updateBanner({
            id: bannerData._id as string,
            payload: formData,
          }).unwrap()
        : await createBanner(formData).unwrap();

      if (res.success) {
        toast.success(
          `Banner ${bannerData ? "updated" : "created"} successfully!`
        );
        form.reset();
        setImage(null);
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save banner.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {bannerData ? "Update Banner" : "Add Banner"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 max-h-[80vh] overflow-y-auto p-2"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Banner title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "true")}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date / End Date */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? field.value.split("T")[0] : ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? field.value.split("T")[0] : ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Image */}
            <div>
              <FormLabel>
                Banner Image <small className="font-bold">(Max 01 image)</small>
              </FormLabel>

              <SingleImageUploader onChange={setImage} defaultFile={image} />
              {bannerData?.image && !image && (
                <img
                  src={bannerData?.image as string}
                  alt="Current Cover"
                  className="mt-2 h-24 rounded"
                />
              )}
            </div>

            <Button type="submit" className="w-full">
              {bannerData
                ? updating
                  ? "Updating..."
                  : "Update Banner"
                : creating
                ? "Creating..."
                : "Create Banner"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

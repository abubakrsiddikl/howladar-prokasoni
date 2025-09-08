import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import type { IGenre } from "@/types";
import {
  useCreateGenreMutation,
  useUpdateGenreMutation,
} from "@/redux/feature/Genre/genre.api";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface GenreModalProps {
  mode: "create" | "update";
  initialData?: IGenre;
}
const genreValidationSchema = z.object({
  name: z.string().min(2, "Name is required").max(50),
  description: z.string().optional(),
});

export default function AddGenreModal({ mode, initialData }: GenreModalProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<IGenre>({
    resolver: zodResolver(genreValidationSchema),
    defaultValues: {
      name: "",
      description: "",
      ...initialData,
    },
  });

  const [createGenre, { isLoading: creating }] = useCreateGenreMutation();
  const [updateGenre, { isLoading: updating }] = useUpdateGenreMutation();

  // reset form when modal opens
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({ name: "", description: "" });
    }
  }, [initialData, form]);

  const onSubmit = async (data: IGenre) => {
    try {
      if (mode === "create") {
        const res = await createGenre(data).unwrap();
        if (res.success) {
          toast.success(`${data.name} Genre Added Successful`);
        }
      } else if (mode === "update" && initialData?.slug) {
        const res = await updateGenre({
          slug: initialData.slug,
          data: data,
        }).unwrap();
        if (res.success) {
          toast.success(`${data.name} Genre Update Successful`);
        }
      }
      setOpen(false);
    } catch (err) {
      console.error("Genre save failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{mode === "create" ? "Add New Genre" : ""}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Genre" : "Update Genre"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new book genre."
              : "Update existing genre details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter genre name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter short description (Optional)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating
                  ? "Saving..."
                  : mode === "create"
                  ? "Create"
                  : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
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
import { useState } from "react";
import { toast } from "sonner";

import SingleImageUploader from "@/components/SingleImageUploader";

import type { FileMetadata } from "@/hooks/use-file-upload";
import { useUpdateBookMutation } from "@/redux/feature/Book/book.api";
import { useGetAllGenresQuery } from "@/redux/feature/Genre/genre.api";
import type { IBook, IErrorResponse } from "@/types";

const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.number().min(1, "Price is required"),
  stock: z.number().min(0),
  genre: z.string().min(1, "Genre is required "),
  publisher: z.string().min(1, "Publisher is required"),
  discount: z.number().min(0).max(100),
  description: z.string().min(5).optional(),
});

type UpdateBookValues = z.infer<typeof updateBookSchema>;

export default function UpdateBookModal({
  open,
  setOpen,
  book,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  book: IBook;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);
  const [deletePreviewImages, setDeletePreviewImages] = useState<string[]>([]);

  const [updateBook, { isLoading }] = useUpdateBookMutation();
  const { data: genresData } = useGetAllGenresQuery(undefined);

  const genresOptions = genresData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const form = useForm<UpdateBookValues>({
    resolver: zodResolver(updateBookSchema),
    defaultValues: {
      title: book?.title,
      author: book?.author,
      price: book?.price + book?.discountedPrice,
      stock: book?.stock,
      genre: book?.genre?._id || "",
      publisher: book?.publisher,
      discount: book?.discount,
      description: book?.description,
    },
  });

  const handleUpdateBook = async (data: UpdateBookValues) => {
    try {
      const finalPreviewImages =
        book.previewImages?.filter(
          (url) => !deletePreviewImages.includes(url)
        ) || [];

      const payload = {
        ...data,
        deletePreviewImages,
        previewImages: finalPreviewImages,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (image instanceof File) {
        formData.append("file", image);
      }
      if (images.length) {
        images.forEach((img) => {
          if (img instanceof File) {
            formData.append("files", img);
          }
        });
      }
      // console.log(payload)
      // console.log(formData.get("data"));
      // console.log("This is file", formData.get("file"));
      // console.log("This files", formData.getAll("files"));
      const res = await updateBook({ id: book._id, formData }).unwrap();
      if (res.success) {
        toast.success("Book updated successfully!");
        setImage(null);
        setImages([]);
        setDeletePreviewImages([]);
        setOpen(false);
      }
    } catch (error) {
      let err: IErrorResponse | undefined;
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as any).data === "object"
      ) {
        err = (error as { data: IErrorResponse }).data;
      }

      if (err?.message) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Book</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateBook)}
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
                    <Input placeholder="Enter book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              {/* <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        // Remove spinner arrows & scroll wheel
                        onWheel={(e) => e.currentTarget.blur()}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        // Remove spinner arrows & scroll wheel
                        onWheel={(e) => e.currentTarget.blur()}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Genre */}
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || book?.genre?.name}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genresOptions?.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value as string}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Publisher */}
            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publisher</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter publisher name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Discount */}
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      // Remove spinner arrows & scroll wheel
                      onWheel={(e) => e.currentTarget.blur()}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Cover Image */}
            <div>
              <FormLabel className="mb-2">Update Cover Image</FormLabel>
              <SingleImageUploader onChange={setImage} />
              {book?.coverImage && !image && (
                <img
                  src={book.coverImage}
                  alt="Current Cover"
                  className="mt-2 h-24 rounded"
                />
              )}
            </div>

            {/* Preview Images */}
            <div>
              {/* <FormLabel className="mb-2">Update Preview Images</FormLabel>
              <MultipleImageUploader onChange={setImages} /> */}

              {/* Existing images with delete option */}
              {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {book?.previewImages
                  ?.filter((url) => !deletePreviewImages.includes(url))
                  .map((url: string) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        alt="Preview"
                        className="rounded-md h-24 w-full object-cover"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1"
                        onClick={() =>
                          setDeletePreviewImages((prev) => [...prev, url])
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
              </div> */}
            </div>

            <Button type="submit" className="w-full">
              {isLoading ? "Updating..." : "Update Book"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

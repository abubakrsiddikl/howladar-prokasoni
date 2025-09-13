import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import SingleImageUploader from "@/components/SingleImageUploader";
import { useState } from "react";
import { toast } from "sonner";
import type { FileMetadata } from "@/hooks/use-file-upload";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { useAddNewBookMutation } from "@/redux/feature/Book/book.api";

import { useGetAllGenresQuery } from "@/redux/feature/Genre/genre.api";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.number().min(1, "Price is required"),
  stock: z.number().min(0),
  genre: z.string().min(1, "Genre is required "),
  publisher: z.string().min(1, "Publisher is required"),
  discount: z.number().min(0).max(100),
  description: z.string().min(5).optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

export default function AddBookModal() {
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);
  const [open, setOpen] = useState(false);
  const [addNewBook, { isLoading }] = useAddNewBookMutation();
  const { data } = useGetAllGenresQuery(undefined);
  const genresData = data?.data || [];
  const genresOptions = genresData?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      price: 0,
      stock: 0,
      genre: "",
      publisher: "",
      discount: 0,
      description: "",
    },
  });

  // handle submit inside modal
  const handleAddBook = async (data: BookFormValues) => {
    try {
      const payload: BookFormValues = {
        author: data.author,
        discount: data.discount,
        genre: data.genre,
        publisher: data.publisher,
        price: data.price,
        stock: data.stock,
        title: data.title,
        description: data.description,
      };
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));
      if (image) formData.append("file", image);
      if (images.length)
        images.forEach((img) => formData.append("files", img as File));

      const res = await addNewBook(formData).unwrap();
      if (res.success) {
        toast.success("Book added successfully!");
        form.reset();
        setImage(null);
        setImages([]);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add book.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Book</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Book</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddBook)}
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
                    <FormMessage />
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
                    <FormMessage />
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormMessage />
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
                    <Input placeholder="Enter Prokasoni name " {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image */}
            <div>
              <FormLabel className="mb-2">
                Upload Book CoverImage{" "}
                <small className="font-bold">(Max 01 image)</small>
              </FormLabel>
              <SingleImageUploader onChange={setImage} />
            </div>

            <div>
              <FormLabel className="mb-2">
                Upload Book Preview Image{" "}
                <small className="font-bold">(Max 10 image)</small>
              </FormLabel>
              <MultipleImageUploader
                onChange={setImages}
              ></MultipleImageUploader>
            </div>

            <Button type="submit" className="w-full">
              {isLoading ? "Add Book..." : "Add Book"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

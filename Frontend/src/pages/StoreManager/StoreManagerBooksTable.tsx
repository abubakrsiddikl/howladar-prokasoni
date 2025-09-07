"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { IBook } from "@/types";

interface Props {
  books: IBook[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function StoreManagerBooksTable({
  books,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 border">Image</TableHead>
            <TableHead className="p-2 border">Title</TableHead>
            <TableHead className="p-2 border">Author</TableHead>
            <TableHead className="p-2 border">Genre</TableHead>
            <TableHead className="p-2 border">Original Price</TableHead>
            <TableHead className="p-2 border">Price</TableHead>
            <TableHead className="p-2 border">Discount</TableHead>
            <TableHead className="p-2 border">Stock</TableHead>
            <TableHead className="p-2 border text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book._id}>
              <TableCell className="p-2 border">
                <img
                  src={book.coverImage || "/placeholder.png"}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell className="p-2 border">{book.title}</TableCell>
              <TableCell className="p-2 border">{book.author}</TableCell>
              <TableCell className="p-2 border">{book.genre}</TableCell>
              <TableCell className="p-2 border">
                {book.price + book.discountedPrice}৳
              </TableCell>
              <TableCell className="p-2 border">{book.price}৳</TableCell>
              <TableCell className="p-2 border">{book.discount}%</TableCell>
              <TableCell className="p-2 border">{book.stock}</TableCell>
              <TableCell className="p-2 border text-center space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(book._id)}
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(book._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
// export default function StoreManagerBooksTable({ books, onEdit, onDelete }: Props) {
//   return (
//     <div className="overflow-x-auto w-full rounded-lg shadow-md">
//       <div className="min-w-[800px]">
//         <Table className="w-full table-auto">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="p-2 border">Image</TableHead>
//               <TableHead className="p-2 border">Title</TableHead>
//               <TableHead className="p-2 border">Author</TableHead>
//               <TableHead className="p-2 border">Genre</TableHead>
//               <TableHead className="p-2 border">Price</TableHead>
//               <TableHead className="p-2 border">Discount</TableHead>
//               <TableHead className="p-2 border">Stock</TableHead>
//               <TableHead className="p-2 border text-center">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {books.map((book) => (
//               <TableRow key={book._id}>
//                 <TableCell className="p-2 border">
//                   <img
//                     src={book.coverImage || "/placeholder.png"}
//                     alt={book.title}
//                     className="w-12 h-16 object-cover rounded"
//                   />
//                 </TableCell>
//                 <TableCell className="p-2 border">{book.title}</TableCell>
//                 <TableCell className="p-2 border">{book.author}</TableCell>
//                 <TableCell className="p-2 border">{book.genre}</TableCell>
//                 <TableCell className="p-2 border">{book.price}৳</TableCell>
//                 <TableCell className="p-2 border">{book.discount}%</TableCell>
//                 <TableCell className="p-2 border">{book.stock}</TableCell>
//                 <TableCell className="p-2 border text-center space-x-2">
//                   <Button size="icon" variant="outline" onClick={() => onEdit(book._id)}>
//                     <Edit className="w-4 h-4 text-blue-600" />
//                   </Button>
//                   <Button size="icon" variant="destructive" onClick={() => onDelete(book._id)}>
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

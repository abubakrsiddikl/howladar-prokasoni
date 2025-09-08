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
import type { IGenre } from "@/types";

interface Props {
  genres: IGenre[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function StoreManagerBookGenreTable({
  genres,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 border">Genre Name</TableHead>

            <TableHead className="p-2 border text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {genres.map((genre) => (
            <TableRow key={genre._id}>
              <TableCell className="p-2 border">{genre.name}</TableCell>

              <TableCell className="p-2 border text-center space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(genre._id as string)}
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(genre._id as string)}
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

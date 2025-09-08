import AddBookModal from "@/components/modules/StoreManager/AddBookModal";
import StoreManagerBooksTable from "../../components/modules/StoreManager/StoreManagerBooksTable";
import { useGetAllBookQuery } from "@/redux/feature/Book/book.api";

export default function AddBook() {
  const { data: books } = useGetAllBookQuery(undefined);
  const handleEdit = (id: string) => {
    console.log("Edit", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete", id);
  };
  return (
    <div>
      <div className="flex justify-end mb-2">
        <AddBookModal></AddBookModal>
      </div>
      {/* store manager books */}
      <div className="">
        <StoreManagerBooksTable
          books={books?.data || []}
          onDelete={handleDelete}
          onEdit={handleEdit}
        ></StoreManagerBooksTable>
      </div>
    </div>
  );
}

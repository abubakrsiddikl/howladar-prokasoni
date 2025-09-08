import AddBookModal from "@/components/modules/StoreManager/AddBookModal";
import StoreManagerBooksTable from "../../components/modules/StoreManager/StoreManagerBooksTable";
import {
  useDeleteSingleBookMutation,
  useGetAllBookQuery,
} from "@/redux/feature/Book/book.api";
import Swal from "sweetalert2";
export default function AddBook() {
  const { data: books } = useGetAllBookQuery(undefined);
  const [deleteBook] = useDeleteSingleBookMutation();
  const handleEdit = (id: string) => {
    console.log("Edit", id);
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `আপনি কি নিশ্চিত "${name}" কে মুছে  ফেলতে চান !`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteBook(id);
        if (res.data?.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      }
    });
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

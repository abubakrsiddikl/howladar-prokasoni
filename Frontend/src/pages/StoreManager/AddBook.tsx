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
  

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত ?",
      text: `আপনি কি নিশ্চিত "${name}" বই কে মুছে  ফেলতে চান !`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "না",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যা",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteBook(id);
        if (res.data?.success) {
          Swal.fire({
            title: "ডিলেটেড !",
            text: "আপনার বইটি  ডিলিট সম্পূর্ণ হয়েছে .",
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
        ></StoreManagerBooksTable>
      </div>
    </div>
  );
}

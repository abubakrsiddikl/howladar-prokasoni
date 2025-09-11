import AddBookModal from "@/components/modules/StoreManager/AddBookModal";
import StoreManagerBooksTable from "../../components/modules/StoreManager/StoreManagerBooksTable";
import {
  useDeleteSingleBookMutation,
  useGetAllBookQuery,
} from "@/redux/feature/Book/book.api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Swal from "sweetalert2";
import { useState } from "react";

export default function AddBook() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const { data: books } = useGetAllBookQuery({
    page: currentPage,
    limit: limit,
  });
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
  const totalPage = books?.meta?.totalPage || 1;

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
      {totalPage > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prv) => prv - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <div className="flex">
                {Array.from({ length: totalPage }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem
                      key={page}
                      onClick={() => setCurrentPage(page)}
                    >
                      <PaginationLink isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </div>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prv) => prv + 1)}
                  className={
                    currentPage === totalPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

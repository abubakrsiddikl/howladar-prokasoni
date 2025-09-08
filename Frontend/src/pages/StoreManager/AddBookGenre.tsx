import AddGenreModal from "@/components/modules/StoreManager/AddGenreModal";
import StoreManagerBookGenreTable from "@/components/modules/StoreManager/StoreManagerBookGenreTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useGetAllGenresQuery,
} from "@/redux/feature/Genre/genre.api";
// import Swal from "sweetalert2";

export default function AddBookGenre() {
  const { data: genres, isLoading } = useGetAllGenresQuery(undefined);
  // const [deleteGenre] = useDeleteGenreMutation();
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  const handleEdit = () => {
   
  };

  const handleDelete = () => {
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: `আপনি কি নিশ্চিত "${name}" কে মুছে  ফেলতে চান !`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, delete it!",
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     const res = await deleteGenre(id);
    //     if (res.data?.success) {
    //       Swal.fire({
    //         title: "Deleted!",
    //         text: "Your file has been deleted.",
    //         icon: "success",
    //       });
    //     }
    //   }
    // });
  };
  return (
    <div>
      {/* add genre modal */}
      <div className="flex justify-end mb-5">
        <AddGenreModal mode="create"></AddGenreModal>
      </div>
      <div>
        <StoreManagerBookGenreTable
          genres={genres?.data || []}
          onDelete={handleDelete}
          onEdit={handleEdit}
        ></StoreManagerBookGenreTable>
      </div>
    </div>
  );
}

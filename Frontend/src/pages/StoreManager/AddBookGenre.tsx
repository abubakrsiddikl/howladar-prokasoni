import AddGenreModal from "@/components/modules/StoreManager/AddGenreModal";
import StoreManagerBookGenreTable from "@/components/modules/StoreManager/StoreManagerBookGenreTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetAllGenresQuery } from "@/redux/feature/Genre/genre.api";

export default function AddBookGenre() {
  const { data: genres, isLoading } = useGetAllGenresQuery(undefined);
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  const handleEdit = (id: string) => {
    console.log("Edit", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete", id);
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

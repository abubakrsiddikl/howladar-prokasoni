import Banner from "@/components/modules/HomePage/Banner";
import GenreWiseBooks from "@/components/modules/HomePage/GenreWiseBooks";
import HomeModal from "@/components/modules/HomePage/HomeModal";

export default function HomePage() {
  return (
    <div className="my-7">
      <HomeModal></HomeModal>
      <Banner></Banner>
      <GenreWiseBooks></GenreWiseBooks>
    </div>
  );
}

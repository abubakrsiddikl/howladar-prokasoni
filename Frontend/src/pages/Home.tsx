import Banner from "@/components/modules/HomePage/Banner";
import GenreWiseBooks from "@/components/modules/HomePage/GenreWiseBooks";
import HomeModal from "@/components/modules/HomePage/HomeModal";
import Seo from "@/components/modules/Seo/Seo";

export default function HomePage() {
  return (
    <div className="my-7">
      <Seo
        title="হাওলাদার প্রকাশনী | অনলাইন বইয়ের বাজার"
        description="বাংলাদেশের অনলাইন বইয়ের বাজার — হাওলাদার প্রকাশনী থেকে উপন্যাস, ইসলামিক ও শিক্ষাসাহিত্য কিনুন সাশ্রয়ী মূল্যে।"
      ></Seo>
      <HomeModal></HomeModal>
      <Banner></Banner>
      <GenreWiseBooks></GenreWiseBooks>
    </div>
  );
}

import BannerModal from "@/components/modules/StoreManager/BannerModal";
import StoreManagerBannerTable from "@/components/modules/StoreManager/StoreManagerBannerTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetAllBannerQuery } from "@/redux/feature/Banner/banner.api";
import { useState } from "react";

export default function AddBanner() {
  const [open, setOpen] = useState(false);
  const { data: banners, isLoading } = useGetAllBannerQuery();
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div>
      {/* Add Banner Modal */}
      <div>
        <BannerModal open={open} setOpen={setOpen}></BannerModal>
      </div>
      {/* Banner Table */}
      <div>
        <StoreManagerBannerTable
          banners={banners?.data || []}
        ></StoreManagerBannerTable>
      </div>
    </div>
  );
}

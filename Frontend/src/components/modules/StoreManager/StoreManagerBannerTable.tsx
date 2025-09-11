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
import type { IBanner } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import { useGetSingleBannerQuery } from "@/redux/feature/Banner/banner.api";
import BannerModal from "./BannerModal";

interface Props {
  banners: IBanner[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export default function StoreManagerBannerTable({ banners }: Props) {
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const { data: updateBanner } = useGetSingleBannerQuery(
    selectedBannerId as string,
    {
      skip: !selectedBannerId,
    }
  );
  

  //   handel banner update
  const handleUpdateBanner = (id: string) => {
    setSelectedBannerId(id);
    setOpen(true)
  };
  //   handle delete banner
  const handleDeleteBanner = (id: string) => {
    setSelectedBannerId(id);
  };
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 border">Image</TableHead>
            <TableHead className="p-2 border">Title</TableHead>
            <TableHead className="p-2 border">Active</TableHead>
            <TableHead className="p-2 border">Start Date</TableHead>
            <TableHead className="p-2 border">End Date</TableHead>

            <TableHead className="p-2 border text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner._id}>
              <TableCell className="p-2 border">
                <img
                  src={banner.image || "/placeholder.png"}
                  alt={banner.title}
                  className="w-12 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell className="p-2 border">{banner.title}</TableCell>
              {/* Active Cell */}
              <TableCell className="p-2 border">
                {banner.active === true ? "Active" : "InActive"}
              </TableCell>

              <TableCell className="p-2 border">
                {banner?.createdAt
                  ? format(new Date(banner?.createdAt), "MMM dd, yyyy")
                  : "N/A"}
              </TableCell>
              <TableCell className="p-2 border">
                {banner?.createdAt
                  ? format(new Date(banner?.createdAt), "MMM dd, yyyy")
                  : "N/A"}
              </TableCell>
              {/* Action cell */}
              <TableCell className="p-2 border text-center space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleUpdateBanner(banner._id as string)}
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDeleteBanner(banner._id as string)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedBannerId && updateBanner && (
        <>
          <BannerModal
            open={open}
            setOpen={setOpen}
            bannerData={updateBanner.data || {}}
            
          ></BannerModal>
        </>
      )}
    </div>
  );
}

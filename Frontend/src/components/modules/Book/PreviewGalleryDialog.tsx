"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PreviewGalleryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  galleryItems: { original: string; thumbnail: string }[];
}

export default function PreviewGalleryDialog({
  open,
  setOpen,
  title,
  galleryItems,
}: PreviewGalleryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-4xl h-[90vh] flex flex-col text-black ">
        <DialogHeader>
          
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 border-[5px] border-[#a9a9a9] bg-[#a9a9a9]">
          {galleryItems.length > 0 ? (
            <div className="space-y-4">
              {galleryItems.map((item, index) => (
               <img
                  key={index}
                  src={item.original}
                  alt={`Preview page ${index + 1}`}
                  className="w-full rounded-lg "
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-6">Preview not available</p>
          )}
        </div>
        
      </DialogContent>
    </Dialog>
  );
}

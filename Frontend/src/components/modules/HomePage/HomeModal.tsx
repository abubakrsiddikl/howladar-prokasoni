import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function HomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenModal");
    if (!seen) {
      setOpen(true);
      localStorage.setItem("hasSeenModal", "true");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">কাজ চলমান 🚧</DialogTitle>
          <DialogDescription className="text-center">
            সম্মানিত গ্রাহকগণ,হাওলাদার প্রকাশনী ওয়েব ভার্সন ২.২.০ আপডেট চলছে ।
            বই আপডেট একটি চলমান প্রক্রিয়া। হাওলাদার প্রকাশনী সকল ধরনের বই
            ডেলিভারি দিতে সক্ষম। তাই কোন বই বা প্রোডাক্ট সার্চ করে খুজে না পেলে
            অনুগ্রহ করে নিম্নলিখিত নম্বরে ফোন করুন অথবা হোয়াটসঅ্যাপে মেসেজ করুন
            (+8801936582963)।
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setOpen(false)}>ঠিক আছে</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

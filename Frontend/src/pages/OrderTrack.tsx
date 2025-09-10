"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGetTrackOrderQuery } from "@/redux/feature/Order/order.api";
import OrderTimeline from "@/components/modules/Order/OrderTimeline";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function OrderTrack() {
  const [search, setSearch] = useState("");
  const [orderId, setOrderId] = useState("");

  // only fetch when orderId is set
  const { data, isLoading } = useGetTrackOrderQuery(orderId, {
    skip: !orderId,
  });

  const handleSearch = () => {
    if (search.trim()) {
      setOrderId(search.trim());
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <p className="text-center my-3">Order ID</p>
      <div className="flex justify-center gap-14 items-end">
        <div className="flex flex-col gap-2 mb-4 md:w-[400px]">
          <Input
            type="text"
            placeholder="Search by Order ID (ORD-20250909-0001)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>{isLoading ? <><LoadingSpinner></LoadingSpinner></>:"Order Track"}</Button>
        </div>
      </div>
      <div className="flex justify-center">
        {isLoading && <p>Loading...</p>}

        {data && <OrderTimeline order={data || []}></OrderTimeline>}
      </div>
    </div>
  );
}

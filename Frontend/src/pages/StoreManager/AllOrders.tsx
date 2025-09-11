import OrderTable from "@/components/Table/OrderTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetAllOrderQuery } from "@/redux/feature/Order/order.api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

export default function AllOrders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const { data: orders, isLoading } = useGetAllOrderQuery({
    page: currentPage,
    limit: limit,
  });

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  const totalPage = orders?.meta?.totalPage || 1;

  return (
    <div>
      <OrderTable orders={orders?.data || []}></OrderTable>
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

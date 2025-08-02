import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getOrders } from "../../https/index";
import OrderList from "./OrderList";

const MAX_RECENT = 5;
const DEBOUNCE_DELAY = 300;
const RecentOrders = () => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isError]);

  const orders = resData?.data?.data ?? [];

  // Filter orders based on search term (search by customer name or order ID)
  const filteredOrders = useMemo(() => {
    if (!debouncedSearchTerm) return orders;

    return orders.filter((order) => {
      const customerName = order.customerDetails?.name.toLowerCase() ?? "";
      const orderId = String(Math.floor(new Date(order.orderDate).getTime()));
      return (
        customerName.includes(debouncedSearchTerm) ||
        orderId.includes(debouncedSearchTerm)
      );
    });
  }, [debouncedSearchTerm, orders]);

  // Decide how many orders to show depending on showAll flag & filtered results
  const ordersToShow = showAll
    ? filteredOrders
    : filteredOrders.slice(0, MAX_RECENT);

  return (
    <div className="px-8 mt-6">
      <div className="bg-[#1a1a1a] w-full h-[450px] rounded-lg flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 flex-shrink-0">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Recent Orders
          </h1>
          {filteredOrders.length > MAX_RECENT && (
            <button
              className="text-[#025cca] text-sm font-semibold focus:outline-none"
              onClick={() => setShowAll((prev) => !prev)}
              aria-label={showAll ? "Show fewer orders" : "View all orders"}
              type="button"
            >
              {showAll ? "Show less" : "View all"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mx-6 flex-shrink-0">
          <FaSearch className="text-[#f5f5f5]" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search recent orders"
            placeholder="Search recent orders"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] flex-grow"
          />
        </div>

        <div
          className="mt-4 px-6 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 flex-grow"
          style={{
            willChange: "scroll-position",
            WebkitOverflowScrolling: "touch",
            transform: "translateZ(0)",
          }}
          tabIndex={0}
          role="region"
          aria-live="polite"
          aria-label="List of recent orders"
        >
          {ordersToShow.length > 0 ? (
            ordersToShow.map((order) => (
              <OrderList key={order._id} order={order} />
            ))
          ) : (
            <p className="col-span-3 text-gray-500">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;

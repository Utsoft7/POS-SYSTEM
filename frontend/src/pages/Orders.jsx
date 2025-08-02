import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import BottomNav from "../components/shared/BottomNav";
import { getOrders } from "../https/index";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "In Progress", value: "In Progress" },
  { label: "Ready", value: "Ready" },
  { label: "Completed", value: "Completed" },
];

const FilterButton = React.memo(({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`text-[#ababab] text-lg rounded-lg px-5 py-2 font-semibold transition-colors duration-200 ${
      isActive ? "bg-[#383838]" : "hover:bg-[#2f2f2f]"
    }`}
  >
    {label}
  </button>
));

const Orders = () => {
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const {
    data: resData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", activeStatus],
    queryFn: () => getOrders({ status: activeStatus }),
    placeholderData: keepPreviousData,
  });

  const filteredOrders = useMemo(() => {
    const orders = resData?.data?.data || [];
    if (activeStatus === "all") return orders;
    return orders.filter((order) => order.orderStatus === activeStatus);
  }, [resData, activeStatus]);

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="col-span-3 text-center text-gray-400">
          Loading orders...
        </p>
      );
    }
    if (filteredOrders.length > 0) {
      return filteredOrders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ));
    }
    return (
      <p className="col-span-3 text-center text-gray-500">
        No orders found for this status.
      </p>
    );
  };

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Orders
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          {filterOptions.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              isActive={activeStatus === option.value}
              onClick={() => setActiveStatus(option.value)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-16 py-4  overflow-y-auto scrollbar-hide pb-24">
        {renderContent()}
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;

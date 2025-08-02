import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import BottomNav from "../components/shared/BottomNav";
import TableCard from "../components/tables/TableCard";
import { getTables } from "../https";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Booked", value: "booked" },
  { label: "Available", value: "available" },
];

const Tables = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    placeholderData: keepPreviousData,
    onError: () => {
      enqueueSnackbar("Could not fetch tables. Please try again.", {
        variant: "error",
      });
    },
  });

  const filteredTables = useMemo(() => {
    const tables = data?.data?.data || [];
    if (statusFilter === "all") return tables;

    return tables.filter(
      (table) => table.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [data, statusFilter]);

  const FilterButton = ({ label, value }) => (
    <button
      type="button"
      onClick={() => {
        setStatusFilter(value);
        setSelectedTable(null);
      }}
      className={`rounded-lg px-4 py-1.5 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
        statusFilter.toLowerCase() === value.toLowerCase()
          ? "bg-[#383838] text-[#f5f5f5]"
          : "text-[#ababab]"
      }`}
      aria-pressed={statusFilter.toLowerCase() === value.toLowerCase()}
    >
      {label}
    </button>
  );

  return (
    <section className="bg-[#1f1f1f] min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wide">
            Tables
          </h1>
        </div>
        <div
          className="flex items-center gap-2"
          role="radiogroup"
          aria-label="Filter tables by status"
        >
          {FILTER_OPTIONS.map((option) => (
            <FilterButton key={option.value} {...option} />
          ))}
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <main
          className="flex-grow p-4 overflow-y-auto scrollbar-hide"
          tabIndex={0}
          aria-live="polite"
          aria-busy={isLoading}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <p className="col-span-full text-center text-gray-400">
                Loading tables...
              </p>
            ) : isError ? (
              <p className="col-span-full text-center text-red-400">
                Error loading tables.
              </p>
            ) : filteredTables.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No tables found for the "{statusFilter}" filter.
              </p>
            ) : (
              filteredTables.map((table) => (
                <div
                  key={table._id}
                  onClick={() => setSelectedTable(table)}
                  className={`cursor-pointer rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-400 ${
                    selectedTable?._id === table._id
                      ? "ring-2 ring-yellow-400 bg-[#2a2a2a] shadow-lg"
                      : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedTable(table);
                    }
                  }}
                  aria-pressed={selectedTable?._id === table._id}
                  aria-label={`Select table ${table.tableNo}`}
                >
                  <TableCard
                    id={table._id}
                    name={table.tableNo}
                    status={table.status}
                    initials={table.currentOrder?.customerDetails?.name}
                    seats={table.seats}
                    isSelected={selectedTable?._id === table._id}
                  />
                </div>
              ))
            )}
          </div>
        </main>

        {selectedTable && (
          <aside className="w-80 bg-[#232323] p-4 overflow-y-auto scrollbar-hide border-l border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">
              Table {selectedTable.tableNo} Details
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong className="text-gray-100 font-medium">Status:</strong>{" "}
                {selectedTable.status}
              </p>
              <p>
                <strong className="text-gray-100 font-medium">Seats:</strong>{" "}
                {selectedTable.seats}
              </p>
              <hr className="border-gray-600 my-3" />
              <h4 className="font-semibold text-white">Current Order</h4>
              {selectedTable.currentOrder ? (
                <div className="text-sm space-y-1">
                  <p>
                    <strong className="text-gray-100">Customer:</strong>{" "}
                    {selectedTable.currentOrder.customerDetails.name}
                  </p>
                  <p>
                    <strong className="text-gray-100">Order Status:</strong>{" "}
                    {selectedTable.currentOrder.orderStatus}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No active order</p>
              )}
            </div>
          </aside>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;

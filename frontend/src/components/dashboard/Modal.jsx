import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { addTable } from "../../https";

const Modal = ({ setIsTableModalOpen, existingTables = [] }) => {
  const [tableData, setTableData] = useState({ tableNo: "", seats: "" });
  const [errors, setErrors] = useState({ tableNo: "", seats: "" });

  const existingTableNumbers = existingTables.map((table) =>
    table.tableNo.toString()
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleanValue = value.replace(/[^0-9]/g, "");

    setTableData((prev) => ({ ...prev, [name]: cleanValue }));

    if (name === "tableNo") {
      if (existingTableNumbers.includes(cleanValue)) {
        setErrors((prev) => ({
          ...prev,
          tableNo: "Table number already exists.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, tableNo: "" }));
      }
    }

    if (name === "seats") {
      const numSeats = parseInt(cleanValue, 10);
      if (numSeats > 15) {
        setErrors((prev) => ({
          ...prev,
          seats: "Maximum number of seats is 15.",
        }));
      } else if (cleanValue && numSeats < 1) {
        setErrors((prev) => ({
          ...prev,
          seats: "Minimum number of seats is 1.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, seats: "" }));
      }
    }
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
      setIsTableModalOpen(false);
      enqueueSnackbar(res.data.message, { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const isFormValid =
    !errors.tableNo &&
    !errors.seats &&
    tableData.tableNo.trim() !== "" &&
    tableData.seats.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      tableMutation.mutate(tableData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           {" "}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-7 rounded-lg shadow-lg w-[350px]"
      >
               {" "}
        <div className="flex justify-between items-center mb-5">
                   {" "}
          <h2 className="text-[#f5f5f5] text-xl font-semibold">Add Table</h2>   
               {" "}
          <button
            onClick={() => setIsTableModalOpen(false)}
            className="text-[#f5f5f5] hover:text-red-500"
          >
                        <IoMdClose size={24} />         {" "}
          </button>
                 {" "}
        </div>
               {" "}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                   {" "}
          <div>
                       {" "}
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
                            Table Number            {" "}
            </label>
                       {" "}
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                           {" "}
              <input
                type="text"
                name="tableNo"
                value={tableData.tableNo}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
                autoComplete="off"
              />
                         {" "}
            </div>
                       {" "}
            {errors.tableNo && (
              <p className="text-red-500 text-xs mt-1">{errors.tableNo}</p>
            )}
                     {" "}
          </div>
                   {" "}
          <div>
                       {" "}
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
                            Number of Seats            {" "}
            </label>
                       {" "}
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                           {" "}
              <input
                type="text"
                name="seats"
                value={tableData.seats}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
                autoComplete="off"
              />
                         {" "}
            </div>
                       {" "}
            {errors.seats && (
              <p className="text-red-500 text-xs mt-1">{errors.seats}</p>
            )}
                     {" "}
          </div>
                   {" "}
          <button
            type="submit"
            disabled={!isFormValid || tableMutation.isPending}
            className="w-full rounded-lg mt-10 py-3 text-lg bg-yellow-400 text-gray-900 font-bold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
                        {tableMutation.isPending ? "Adding..." : "Add Table"}   
                 {" "}
          </button>
                 {" "}
        </form>
             {" "}
      </motion.div>
         {" "}
    </div>
  );
};

export default Modal;

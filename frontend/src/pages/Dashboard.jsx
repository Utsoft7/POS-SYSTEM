import { useEffect, useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { MdCategory, MdTableBar } from "react-icons/md";
import Metrics from "../components/dashboard/Metrics";
import Modal from "../components/dashboard/Modal";
import RecentOrders from "../components/dashboard/RecentOrders";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Metrics", "Orders", "Payments"];

const dateOptions = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all_time" },
];

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Metrics");
  const [dateRange, setDateRange] = useState("all_time");

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
  };

  return (
    <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)]">
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }) => (
            <button
              key={action}
              onClick={() => handleOpenModal(action)}
              className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
            >
              {label} {icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#1a1a1a] hover:bg-[#262626] px-4 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md focus:outline-none border-2 border-[#262626]"
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {tabs.map((tab) => (
            <button
              key={tab}
              className={`
               px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                 activeTab === tab
                   ? "bg-[#262626]"
                   : "bg-[#1a1a1a] hover:bg-[#262626]"
               }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Metrics" && <Metrics dateRange={dateRange} />}
      {activeTab === "Orders" && <RecentOrders dateRange={dateRange} />}

      {activeTab === "Payments" && (
        <div className="text-white p-6 container mx-auto flex flex-col items-center">
          <p className="mb-4 text-lg">
            To Analysis the payment, please click the button below for the ADMIN
          </p>
          <a
            href="https://razorpay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Go to Razorpay Dashboard Page
          </a>
        </div>
      )}

      {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
    </div>
  );
};

export default Dashboard;

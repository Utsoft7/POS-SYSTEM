import { useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { CiCircleMore } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setCustomer } from "../../redux/slices/customerSlice";
import Modal from "./Modal";

const navLinks = [
  { path: "/", icon: FaHome, label: "Home" },
  { path: "/orders", icon: MdOutlineReorder, label: "Orders" },
  { path: "/tables", icon: MdTableBar, label: "Tables" },
  { path: "/more", icon: CiCircleMore, label: "More" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const phoneRegex = /^[6-9]\d{9}$/;

  const isFormValid =
    name.trim() !== "" && phoneRegex.test(phone) && guestCount > 0;

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value.replace(/[^0-9]/g, "");

    if (newPhone.length > 10) {
      setPhoneError("Phone number cannot be more than 10 digits.");
      return;
    }

    setPhone(newPhone);
    setPhoneError("");
  };

  const handleCreateOrder = () => {
    if (!isFormValid) return;
    dispatch(setCustomer({ name, phone, guests: guestCount }));
    navigate("/tables");
    closeModal();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setPhone("");
    setGuestCount(1);
    setPhoneError("");
  };

  const increment = () => setGuestCount((prev) => Math.min(prev + 1, 10));
  const decrement = () => setGuestCount((prev) => Math.max(prev - 1, 1));
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around">
        {navLinks.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center justify-center font-bold w-1/4 rounded-[20px] transition-colors ${
              isActive(path) ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
            }`}
          >
            <Icon className="inline mr-2" size={20} />
            <p>{label}</p>
          </button>
        ))}
        <button
          disabled={isActive("/tables") || isActive("/menu")}
          onClick={openModal}
          className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-4 items-center disabled:opacity-50"
        >
          <BiSolidDish size={40} />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium">
            Customer Name
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter customer name"
              className="bg-transparent flex-1 text-white focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-[#ababab] mb-2 text-sm font-medium">
            Customer Phone
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input
              value={phone}
              onChange={handlePhoneChange}
              type="tel"
              maxLength="10"
              placeholder="Enter 10-digit mobile number"
              className="bg-transparent flex-1 text-white focus:outline-none"
            />
          </div>
          {phoneError && (
            <p className="text-red-500 text-xs mt-1">{phoneError}</p>
          )}
        </div>
        <div className="mt-3">
          <label className="block mb-2 text-sm font-medium text-[#ababab]">
            Guests
          </label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
            <button onClick={decrement} className="text-yellow-500 text-2xl">
              &minus;
            </button>
            <span className="text-white">{guestCount} Person</span>
            <button onClick={increment} className="text-yellow-500 text-2xl">
              &#43;
            </button>
          </div>
        </div>
        <button
          onClick={handleCreateOrder}
          disabled={!isFormValid}
          className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-yellow-600"
        >
          Create Order
        </button>
      </Modal>
    </>
  );
};

export default BottomNav;

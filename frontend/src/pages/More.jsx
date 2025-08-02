import { enqueueSnackbar } from "notistack";
import React, { useCallback } from "react";
import {
  IoAnalytics,
  IoHelpCircleOutline,
  IoLogOutOutline,
  IoRestaurantOutline,
  IoSettingsOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/shared/BottomNav";
import { logout } from "../https";

const MoreOption = React.memo(({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full p-4 text-left bg-[#262626] rounded-lg hover:bg-[#343434] transition-colors duration-200"
  >
    {React.cloneElement(icon, { className: "mr-4 text-[#ababab]", size: 22 })}
    <span className="font-medium text-[#f5f5f5]">{label}</span>
  </button>
));

const More = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/auth");
      enqueueSnackbar("Logged out successfully!", { variant: "success" });
    } catch (error) {
      console.error("Logout failed:", error);
      enqueueSnackbar("Logout failed. Please try again.", { variant: "error" });
    }
  }, [dispatch, navigate]);

  const menuOptions = [
    {
      icon: <IoStorefrontOutline />,
      label: "Restaurant Profile",
      onClick: () => navigate("/profile"),
    },
    {
      icon: <IoAnalytics />,
      label: "Analytics & Reports",
      onClick: () => navigate("/reports"),
    },
    {
      icon: <IoRestaurantOutline />,
      label: "Menu Management",
      onClick: () => navigate("/menu-editor"),
    },
    {
      icon: <IoSettingsOutline />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
    {
      icon: <IoHelpCircleOutline />,
      label: "Help & Support",
      onClick: () => navigate("/support"),
    },
    {
      icon: <IoLogOutOutline />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-[#1f1f1f] min-h-screen p-4 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">More Options</h1>
        <p className="text-md text-[#ababab]">
          Manage settings, view reports, and more.
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {menuOptions.map((option) => (
            <MoreOption
              key={option.label}
              icon={option.icon}
              label={option.label}
              onClick={option.onClick}
            />
          ))}
        </div>
        <BottomNav />
      </main>
    </div>
  );
};

export default More;

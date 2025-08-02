import { useEffect } from "react";
import { MdRestaurantMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import Bill from "../components/menu/Bill";
import CartInfo from "../components/menu/CartInfo";
import CustomerInfo from "../components/menu/CustomerInfo";
import MenuContainer from "../components/menu/MenuContainer";
import BackButton from "../components/shared/BackButton";
import BottomNav from "../components/shared/BottomNav";

const OrderHeaderInfo = ({ customerName, tableNo }) => (
  <div className="flex items-center gap-3 cursor-pointer">
    <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
    <div className="flex flex-col items-start">
      <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
        {customerName || "Customer Name"}
      </h1>
      <p className="text-xs text-[#ababab] font-medium">
        Table: {tableNo || "N/A"}
      </p>
    </div>
  </div>
);

const Menu = () => {
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const { customerName, table } = useSelector((state) => state.customer);

  return (
    <section className="bg-[#1f1f1f] h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[#2a2a2a] shrink-0">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Menu
          </h1>
        </div>
        <OrderHeaderInfo customerName={customerName} tableNo={table?.tableNo} />
      </header>

      <main className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="flex-[3] flex flex-col overflow-y-auto scrollbar-hide">
          <MenuContainer />
        </div>

        <aside className="flex-[1] bg-[#1a1a1a] rounded-lg flex flex-col overflow-hidden">
          <div className="flex-grow p-4 overflow-y-auto scrollbar-hide space-y-4">
            <CustomerInfo />
            <hr className="border-[#2a2a2a] border-t-2" />
            <CartInfo />
            <hr className="border-[#2a2a2a] border-t-2" />
            <Bill />
          </div>
        </aside>
      </main>

      <BottomNav />
    </section>
  );
};

export default Menu;

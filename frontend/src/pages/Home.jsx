import { useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import Greetings from "../components/home/Greetings";
import MiniCard from "../components/home/MiniCard";
import PopularDishes from "../components/home/PopularDishes";
import RecentOrders from "../components/home/RecentOrders";
import BottomNav from "../components/shared/BottomNav";

const Home = () => {
  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  return (
    <section className="bg-[#1f1f1f]  h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
      <div className="flex-[3]">
        <Greetings />
        <div className="flex items-center w-full gap-3 px-8 mt-8">
          <MiniCard
            title="Total Earnings"
            icon={<BsCashCoin />}
            number={1024}
            footerNum={2.6}
          />
          <MiniCard
            title="In Progress"
            icon={<GrInProgress />}
            number={16}
            footerNum={3.6}
          />
        </div>
        <RecentOrders />
      </div>
      <div className="flex-[2]">
        <PopularDishes />
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;

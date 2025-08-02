import { memo, useCallback, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { GrRadialSelected } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { menus } from "../../constants";
import { addItems } from "../../redux/slices/cartSlice";

const MenuCategory = memo(({ menu, isSelected, onSelect }) => (
  <div
    className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer"
    style={{ backgroundColor: menu.bgColor }}
    onClick={() => onSelect(menu)}
  >
    <div className="flex items-center justify-between w-full">
      <h1 className="text-[#f5f5f5] text-lg font-semibold">
        {menu.icon} {menu.name}
      </h1>
      {isSelected && <GrRadialSelected className="text-white" size={20} />}
    </div>
    <p className="text-[#ababab] text-sm font-semibold">
      {menu.items.length} Items
    </p>
  </div>
));

const MenuItemCard = memo(
  ({ item, quantity, onIncrement, onDecrement, onAddToCart }) => (
    <div className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors duration-200">
      <div className="flex items-start justify-between w-full">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">{item.name}</h1>
        <button
          onClick={() => onAddToCart(item)}
          className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg disabled:bg-gray-600 disabled:text-gray-400"
          disabled={quantity === 0}
        >
          <FaShoppingCart size={20} />
        </button>
      </div>
      <div className="flex items-center justify-between w-full">
        <p className="text-[#f5f5f5] text-xl font-bold">₹{item.price}</p>
        <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg gap-6 w-[50%]">
          <button
            onClick={() => onDecrement(item.id)}
            className="text-yellow-500 text-2xl"
          >
            &minus;
          </button>
          <span className="text-white font-semibold text-lg">{quantity}</span>
          <button
            onClick={() => onIncrement(item.id)}
            className="text-yellow-500 text-2xl"
          >
            &#43;
          </button>
        </div>
      </div>
    </div>
  )
);

const MenuContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState(menus[0]);
  const [itemQuantities, setItemQuantities] = useState({});
  const dispatch = useDispatch();

  const handleIncrement = useCallback((itemId) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: Math.min((prev[itemId] || 0) + 1, 10),
    }));
  }, []);

  const handleDecrement = useCallback((itemId) => {
    setItemQuantities((prev) => {
      const newCount = Math.max((prev[itemId] || 0) - 1, 0);
      const newQuantities = { ...prev };
      if (newCount === 0) {
        delete newQuantities[itemId];
      } else {
        newQuantities[itemId] = newCount;
      }
      return newQuantities;
    });
  }, []);

  const handleAddToCart = useCallback(
    (item) => {
      const quantity = itemQuantities[item.id] || 0;
      if (quantity === 0) return;

      dispatch(
        addItems({
          id: item.id,
          name: item.name,
          pricePerQuantity: item.price,
          quantity: quantity,
          price: item.price * quantity,
        })
      );

      setItemQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[item.id];
        return newQuantities;
      });
    },
    [itemQuantities, dispatch]
  );

  const handleCategorySelect = useCallback((menu) => {
    setSelectedCategory(menu);
    setItemQuantities({});
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-10 py-4">
        {menus.map((menu) => (
          <MenuCategory
            key={menu.id}
            menu={menu}
            isSelected={selectedCategory.id === menu.id}
            onSelect={handleCategorySelect}
          />
        ))}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-10 py-4">
        {selectedCategory?.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            quantity={itemQuantities[item.id] || 0}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </>
  );
};

export default MenuContainer;

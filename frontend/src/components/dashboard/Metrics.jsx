import { itemsData, metricsData } from "../../constants";

const Metrics = () => {
  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            Use these insights to make smarter, data-driven decisions.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {metric.title}
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    <path
                      d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                  <p
                    className="font-medium text-xs"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">Item Details</h2>
          <p className="text-sm text-[#ababab]">
            A complete overview of the product's features, specifications, and
            materials.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {itemsData.map((item, index) => {
            return (
              <div
                key={index}
                className="shadow-sm rounded-lg p-4"
                style={{ backgroundColor: item.color }}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-xs text-[#f5f5f5]">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    >
                      <path d="M5 15l7-7 7 7" />
                    </svg>
                    <p className="font-medium text-xs text-[#f5f5f5]">
                      {item.percentage}
                    </p>
                  </div>
                </div>
                <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Metrics;

import { useState } from "react";
import MultiTimeSeriesLogChart from "../components/chart/MultiTimeSeriesLogChart/MultiTimeSeriesLogChart";
import TimeSeriesLogChart from "../components/chart/TimeSeriesLogChart/TimeSeriesLogChart";
import AllTimeSeriesLogChart from "../components/chart/AllTimeSeriesLogChart/AllTimeSeriesLogChart";
import HoverSeriesLogChart from "../components/chart/HoverSeriesLogChart/HoverSeriesLogChart";

const Tabs = () => {
  // 탭을 선택하는 상태
  const [activeTab, setActiveTab] = useState(1);

  // 각 탭에 해당하는 내용
  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <TimeSeriesLogChart />;
      case 2:
        return <MultiTimeSeriesLogChart />;
      case 3:
        return <AllTimeSeriesLogChart />;
      case 4:
        return <HoverSeriesLogChart />;
      default:
        return <TimeSeriesLogChart />;
    }
  };

  return (
    <div className="">
      {/* 탭 버튼 영역 */}
      <div className="flex ">
        <button
          className={`${
            activeTab === 1
              ? "bg-[#646cff] text-white"
              : "bg-[#fff] text-gray-600 "
          } py-2 px-4 cursor-pointer  rounded-tl-lg transition-all duration-300 mr-2 shadow-[1px_1px_1px_rgba(0,0,0,0.15)]`}
          onClick={() => setActiveTab(1)}
        >
          chart 1
        </button>
        <button
          className={`${
            activeTab === 2
              ? "bg-[#646cff] text-white"
              : "bg-[#fff] text-gray-600"
          } py-2 px-4 cursor-pointer  transition-all duration-300  mr-2 shadow-[1px_1px_1px_rgba(0,0,0,0.15)]`}
          onClick={() => setActiveTab(2)}
        >
          chart 2
        </button>
        <button
          className={`${
            activeTab === 3
              ? "bg-[#646cff] text-white"
              : "bg-[#fff] text-gray-600"
          } py-2 px-4 cursor-pointer  rounded-tr-lg transition-all duration-300 mr-2 shadow-[1px_1px_1px_rgba(0,0,0,0.15)]`}
          onClick={() => setActiveTab(3)}
        >
          chart 3
        </button>
        <button
          className={`${
            activeTab === 4
              ? "bg-[#646cff] text-white"
              : "bg-[#fff] text-gray-600"
          } py-2 px-4 cursor-pointer  rounded-tr-lg transition-all duration-300 shadow-[1px_1px_1px_rgba(0,0,0,0.15)]`}
          onClick={() => setActiveTab(4)}
        >
          chart 4
        </button>
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="p-4 border-t-2 border-gray-300 rounded-b-lg">
        <div className={`${activeTab === 1 ? "block" : "hidden"}`}>
          <TimeSeriesLogChart />
        </div>
        <div className={`${activeTab === 2 ? "block" : "hidden"}`}>
          <MultiTimeSeriesLogChart />
        </div>
        <div className={`${activeTab === 3 ? "block" : "hidden"}`}>
          <AllTimeSeriesLogChart />
        </div>
        <div className={`${activeTab === 4 ? "block" : "hidden"}`}>
          <TimeSeriesLogChart />
        </div>
      </div>
    </div>
  );
};

export default Tabs;

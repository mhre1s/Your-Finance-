import React from 'react'
import Header from "../Components/Header";
import BarChartComp from '../Components/BarChartComp';



const Charts = () => {
  return (
    <div className="dark:text-white dark:bg-gray-950 min-h-screen bg-white flex flex-col">
      <Header />
      <div className="mt-20 w-full flex justify-center">
        <BarChartComp />
      </div>
    </div>
  );
}

export default Charts
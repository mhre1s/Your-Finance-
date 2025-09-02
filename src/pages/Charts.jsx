import React, { useState } from 'react'
import Header from "../Components/Header";
import BarChartComp from '../Components/BarChartComp';
import BarChartYearly from '../Components/BarChartYearly';



const Charts = () => {

  const [currentChart, setCurrentChart] = useState('mensal')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  return (
    <div className="dark:text-white dark:bg-gray-950 min-h-screen bg-white flex flex-col">
      <Header />

      {/* seleção de gráficos mensal ou anual */}

      <div className="flex flex-col justify-center items-center">
        <div className="mt-10 flex justify-evenly w-full">
          <button
            onClick={() =>
              currentChart !== "mensal"
                ? setCurrentChart("mensal")
                : setCurrentChart("mensal")
            }
            className={`text-xl cursor-pointer ${
              currentChart === "mensal" ? `dark:text-sky-300 text-sky-600` : ``
            }`}
          >
            <h2>Mensal</h2>
          </button>

          <button
            onClick={() =>
              currentChart === "anual"
                ? setCurrentChart("anual")
                : setCurrentChart("anual")
            }
            className={`text-xl cursor-pointer ${
              currentChart === "anual" ? `dark:text-sky-300 text-sky-600` : ``
            }`}
          >
            <h2>Anual</h2>
          </button>
        </div>

        {/* datas de início e fim */}

        <div className="flex gap-4 w-full justify-center mt-10">
          <div className="flex gap-3">
            <label className="mt-1" htmlFor="date-start">
              <span>De:</span>
            </label>
            <input
              onChange={(e) => setStartDate(e.target.value)}
              className="w-31 dark:bg-slate-800 bg-slate-200 rounded-lg p-1 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
              type="date"
              name="date-start"
              id="date-start"
              value={startDate}
            />
          </div>
          <div className="flex gap-3">
            <label className="mt-1" htmlFor="date-end">
              <span>Até:</span>
            </label>
            <input
              onChange={(e) => setEndDate(e.target.value)}
              className="w-31 dark:bg-slate-800 bg-slate-200 rounded-lg p-1 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
              type="date"
              name="date-end"
              id="date-end"
              value={endDate}
            />
          </div>
        </div>

        {/*Gráficos de barra e de pizza*/}

        <div className=" overflow-x-auto w-full">
          <div className="mt-20 px-10 flex justify-center w-[830px]">
            {currentChart === "mensal" ? (
              <BarChartComp startDate={startDate} endDate={endDate} />
            ) : (
              <BarChartYearly startDate={startDate} endDate={endDate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts
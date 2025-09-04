import React, { useState } from 'react'
import Header from "../Components/Header";
import BarChartComp from '../Components/BarChartComp';
import BarChartYearly from '../Components/BarChartYearly';
import PieCharts from '../Components/PieCharts';



const Charts = () => {

  const [currentChart, setCurrentChart] = useState('mensal')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  return (
    <div className="dark:text-white dark:bg-gray-950 min-h-screen bg-white flex flex-col">
      <Header />

      {/* seleção de gráficos mensal ou anual */}

      <div className="flex flex-col justify-center items-center px-15 ">
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
              className="w-31 dark:bg-slate-900 bg-slate-200 rounded-lg p-1 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
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
              className="w-31 dark:bg-slate-900 bg-slate-200 rounded-lg p-1 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
              type="date"
              name="date-end"
              id="date-end"
              value={endDate}
            />
          </div>
        </div>

        {/*Gráficos de barra e de pizza*/}
        <div className="flex flex-col gap-6 xs:flex-row items-center w-full justify-center">
          <div className="w-80 sm:w-10/12">
            <div className="mt-20 p-5 flex justify-center overflow-x-auto sm:overflow-x-hidden rounded-lg">
              {currentChart === "mensal" ? (
                <BarChartComp startDate={startDate} endDate={endDate} />
              ) : (
                <BarChartYearly startDate={startDate} endDate={endDate} />
              )}
            </div>
          </div>
          <div className="w-80 flex flex-col mt-20 mb-20 xs:mb-0 p-2 rounded-lg">
            <h4 className="text-center">Principais despesas (R$)</h4>
            <PieCharts startDate = {startDate} endDate = {endDate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts
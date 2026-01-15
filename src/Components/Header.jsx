import React, { useEffect, useState } from "react";
import {
  Menu,
  BarChart,
  LayoutDashboard,
  Coins,
  PlusCircle,
  X,
} from "lucide-react";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import { NavLink } from "react-router";

const Header = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sideBar, setSideBar] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = (e) => {
    e.preventDefault();
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSideBar = () => setSideBar(!sideBar);

  return (
    <>
      {/* Overlay para fechar a sidebar ao clicar fora */}
      {sideBar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity"
          onClick={handleSideBar}
        />
      )}

      {/* Sidebar Reformulada */}
      <aside
        className={`fixed top-0 left-0 z-[70] w-72 h-screen transition-all duration-500 will-change-transform bg-white dark:bg-gray-950 border-r border-slate-200 dark:border-gray-800 shadow-2xl ${
          sideBar
            ? "translate-x-0 ease-[cubic-bezier(0.4,0,0.2,1)]"
            : "-translate-x-full ease-in"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-xl font-black tracking-tighter dark:text-white">
              Menu
            </h2>
            <button
              onClick={handleSideBar}
              className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors text-rose-500"
            >
              <X size={24} />
            </button>
          </div>

          <nav>
            <ul className="flex flex-col gap-2">
              {[
                {
                  to: "/",
                  icon: <LayoutDashboard size={20} />,
                  label: "Dashboard",
                },
                {
                  to: "/charts",
                  icon: <BarChart size={20} />,
                  label: "Gráficos",
                },
                {
                  to: "/transactions",
                  icon: <Coins size={20} />,
                  label: "Transações",
                },
                {
                  to: "/newtransaction",
                  icon: <PlusCircle size={20} />,
                  label: "Adicionar",
                },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setSideBar(false)}
                    className={({ isActive }) => `
                      flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium
                      ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-gray-800">
            <p className="text-xs text-center text-slate-400 uppercase tracking-widest font-bold">
              Your Finance $
            </p>
          </div>
        </div>
      </aside>

      {/* Header Estilizado */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 px-4 sm:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSideBar}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 text-slate-600 dark:text-slate-300"
          >
            <Menu size={24} />
          </button>
        </div>

        <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white italic">
          Your Finance<span className="text-emerald-500 not-italic">$</span>
        </h1>

        <button
          onClick={changeTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 group"
        >
          {theme === "light" ? (
            <RiMoonClearFill
              size={22}
              className="text-slate-600 group-hover:text-indigo-500 transition-colors"
            />
          ) : (
            <RiSunFill
              size={22}
              className="text-yellow-400 group-hover:rotate-90 transition-transform duration-500"
            />
          )}
        </button>
      </header>
    </>
  );
};

export default Header;

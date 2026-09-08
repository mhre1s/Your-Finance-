import React, { useEffect, useState } from "react";
import {
  Menu,
  BarChart3,
  LayoutDashboard,
  ArrowUpDown,
  Plus,
  X,
  LogOut,
  User,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sideBar, setSideBar] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      to: "/",
      icon: <LayoutDashboard size={17} />,
      label: "Dashboard",
    },
    {
      to: "/transactions",
      icon: <ArrowUpDown size={17} />,
      label: "Transações",
    },
    {
      to: "/charts",
      icon: <BarChart3 size={17} />,
      label: "Relatórios",
    },
  ];

  return (
    <>
      {/* Overlay para fechar a sidebar mobile ao clicar fora */}
      {sideBar && (
        <div
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setSideBar(false)}
        />
      )}

      {/* Drawer Mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden ${
          sideBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Wallet size={17} strokeWidth={2.2} />
              </div>
              <span className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
                Your Finances
              </span>
            </div>
            <button
              onClick={() => setSideBar(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Usuário Logado */}
          {user && (
            <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center text-sm shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Links Mobile */}
          <nav className="mt-5 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSideBar(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}

            <NavLink
              to="/newtransaction"
              onClick={() => setSideBar(false)}
              className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Plus size={17} strokeWidth={2.2} />
              Nova Transação
            </NavLink>
          </nav>
        </div>

        {/* Rodapé Drawer */}
        <div className="p-5 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut size={17} />
            <span>Encerrar sessão</span>
          </button>
        </div>
      </aside>

      {/* Header Principal */}
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Lado Esquerdo: Botão Mobile + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSideBar(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              <Menu size={20} />
            </button>

            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Wallet size={17} strokeWidth={2.2} />
              </div>
              <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Your Finances
              </span>
            </NavLink>
          </div>

          {/* Centro: Navegação Desktop (Fintech Clean Style) */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-900/70 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Lado Direito: Ação Nova Transação, Tema e Perfil */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NavLink
              to="/newtransaction"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>Nova Transação</span>
            </NavLink>

            {/* Alternador de Tema */}
            <button
              onClick={changeTheme}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={theme === "light" ? "Mudar para modo escuro" : "Mudar para modo claro"}
              aria-label="Alternar tema visual"
            >
              {theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} className="text-amber-400" />
              )}
            </button>

            {/* Perfil / Sair */}
            {user && (
              <div className="flex items-center pl-2 border-l border-zinc-200 dark:border-zinc-800 gap-2">
                <div
                  className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold flex items-center justify-center text-xs"
                  title={`${user.name} (${user.email})`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={15} />}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Encerrar sessão"
                  aria-label="Sair da conta"
                >
                  <LogOut size={17} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

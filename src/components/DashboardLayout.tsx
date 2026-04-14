import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUpdates } from "../contexts/UpdatesContext";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Calendar,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import logoEmbalsoft from "@/assets/logo-embalsoft.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", disabled: false },
  { icon: RefreshCw, label: "Atualizações", path: "/dashboard/updates", disabled: false },
  { icon: BarChart3, label: "Relatórios", path: "/dashboard/reports", disabled: true },
  { icon: FileText, label: "Documentos", path: "/dashboard/docs", disabled: true },
  { icon: Settings, label: "Configurações", path: "/dashboard/settings", disabled: true },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ÚLTIMOS 30 DIAS");
  const navigate = useNavigate();
  const { unreadCount } = useUpdates();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top for independence */}
      <header className="h-16 shrink-0 border-b border-primary/10 flex items-center px-4 md:px-6 bg-card/70 backdrop-blur-md sticky top-0 z-50 w-full shadow-[0_4px_20px_hsl(197_78%_52%/0.05)]">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileOpen(!mobileOpen);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="p-2 rounded-lg text-muted-foreground hover:text-[#38b6ff] hover:bg-[#38b6ff]/10 hover:shadow-[0_0_15px_rgba(56,182,255,0.4)] transition-all"
          >
            <Menu size={20} />
          </button>
          <span className="text-lg md:text-xl font-bold text-white tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
            Embalsoft Analyze
          </span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
          <img src={logoEmbalsoft} alt="Embalsoft" className="h-10 md:h-14 object-contain" />
        </div>

        <div className="flex-1 flex justify-end relative">
          {/* Tech HUD Date Filter - Chamativo e Funcional */}
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="hidden sm:flex items-center gap-2 bg-black/60 border-2 border-[#38b6ff]/40 hover:border-[#38b6ff] shadow-[0_0_15px_rgba(56,182,255,0.2)] hover:shadow-[0_0_20px_rgba(56,182,255,0.4)] hover:bg-[#38b6ff]/10 text-white font-bold px-4 py-2 rounded-md transition-all duration-300">
            <Calendar size={16} className="text-[#38b6ff] drop-shadow-[0_0_5px_rgba(56,182,255,0.8)]" />
            <span className="text-sm font-sans uppercase tracking-widest leading-none mt-0.5">{selectedFilter}</span>
            <ChevronDown size={16} className={`text-[#38b6ff] transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Funcional */}
          {filterOpen && (
            <div className="absolute top-[120%] right-0 w-60 bg-card/95 backdrop-blur-xl border-2 border-[#38b6ff]/30 shadow-[0_15px_40px_rgba(0,0,0,0.9)] rounded-md flex flex-col p-1.5 z-50 animate-fade-in">
               {["HOJE", "ÚLTIMOS 7 DIAS", "ÚLTIMOS 30 DIAS", "ESTE ANO"].map(option => (
                 <button
                   key={option}
                   onClick={() => { setSelectedFilter(option); setFilterOpen(false); }}
                   className={`text-left px-4 py-3 text-sm font-bold font-sans uppercase tracking-wider rounded transition-all hover:bg-[#38b6ff]/20 hover:text-[#38b6ff] ${
                     selectedFilter === option 
                      ? 'bg-[#38b6ff]/10 text-[#38b6ff] border-l-4 border-[#38b6ff]' 
                      : 'text-white/80 border-l-4 border-transparent'
                   }`}
                 >
                   {option}
                 </button>
               ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`absolute md:static z-40 top-0 left-0 h-full bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out
            ${collapsed ? "md:w-20" : "md:w-64"}
            ${mobileOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Nav starts directly */}

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                disabled={item.disabled}
                onClick={() => !item.disabled && navigate(item.path)}
                title={item.disabled ? "Em breve" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative
                  ${item.disabled 
                    ? "opacity-40 cursor-not-allowed text-muted-foreground bg-transparent border-transparent" 
                    : item.path === window.location.pathname
                      ? "bg-[#38b6ff]/10 text-[#38b6ff] border border-[#38b6ff]/30 shadow-[0_0_10px_rgba(56,182,255,0.1)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10"
                  }
                `}
              >
                <div className="relative">
                  <item.icon size={20} className="shrink-0" />
                  {item.path === '/dashboard/updates' && unreadCount > 0 && collapsed && (
                     <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f48121] rounded-full shadow-[0_0_8px_#f48121] animate-pulse" />
                  )}
                </div>
                {!collapsed && <span>{item.label}</span>}
                
                {/* Badge Number (non-collapsed) */}
                {item.path === '/dashboard/updates' && unreadCount > 0 && !collapsed && (
                   <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-[#f48121]/20 text-[#f48121] border border-[#f48121]/50 rounded-full shadow-[0_0_10px_rgba(244,129,33,0.4)] animate-pulse">
                     {unreadCount}
                   </span>
                )}

                {item.disabled && !collapsed && (
                  <span className="ml-auto text-[9px] uppercase font-bold tracking-widest text-muted-foreground/60 border border-muted-foreground/20 px-1.5 py-0.5 rounded">Em breve</span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border">
            <button onClick={() => navigate("/login")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200">
              <LogOut size={20} className="shrink-0" />
              {!collapsed && <span>Sair</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
          {/* Content */}
          <main className="flex-1 p-4 md:p-6 relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

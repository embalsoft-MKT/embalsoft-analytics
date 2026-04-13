import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
  ChevronDown
} from "lucide-react";
import logoEmbalsoft from "@/assets/logo-embalsoft.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BarChart3, label: "Relatórios", path: "/dashboard/reports" },
  { icon: Users, label: "Clientes", path: "/dashboard/clients" },
  { icon: FileText, label: "Documentos", path: "/dashboard/docs" },
  { icon: Settings, label: "Configurações", path: "/dashboard/settings" },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
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

        <div className="flex-1 flex justify-end">
          {/* Tech HUD Date Filter */}
          <button className="hidden sm:flex items-center gap-2 bg-black/40 border border-white/10 hover:border-[#38b6ff]/50 hover:bg-[#38b6ff]/10 text-muted-foreground hover:text-white px-3 py-1.5 rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(56,182,255,0.2)]">
            <Calendar size={14} className="text-[#38b6ff]" />
            <span className="text-xs font-mono tracking-wider">ÚLTIMOS 30 DIAS</span>
            <ChevronDown size={14} className="opacity-50 ml-1" />
          </button>
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${item.path === "/dashboard"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }
                `}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
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
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

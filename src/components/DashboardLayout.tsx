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
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? "md:w-20" : "md:w-64"}
          ${mobileOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <img src={logoEmbalsoft} alt="Embalsoft" className="h-7 object-contain" />
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="hidden md:flex p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 border-b border-border flex items-center px-4 md:px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-30 relative">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
            <img src={logoEmbalsoft} alt="Embalsoft Analytics" className="h-10 md:h-12 object-contain" />
          </div>

          <div className="flex-1 flex justify-end"></div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";

const stats = [
  { label: "Receita Total", value: "R$ 124.500", change: "+12.5%", icon: TrendingUp },
  { label: "Clientes Ativos", value: "1.284", change: "+3.2%", icon: Users },
  { label: "Relatórios", value: "48", change: "+8", icon: BarChart3 },
  { label: "Documentos", value: "312", change: "+24", icon: FileText },
];

const DashboardHome = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visão geral dos seus indicadores
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-5 hover:glow-primary transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon size={18} className="text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-primary mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Área de gráficos e conteúdo — em breve
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;

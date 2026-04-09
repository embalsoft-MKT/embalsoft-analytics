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
        <h1 className="text-2xl font-bold">Embalsoft Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visão geral dos seus indicadores
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl p-5 transition-all duration-300 group
              bg-card border border-border/40 hover:border-primary/40 hover:glow-primary
              animate-fade-in-up-delay-${i + 1}`}
          >
            {/* Subtle glow accent */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 blur-2xl transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <stat.icon size={16} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-primary mt-1 font-medium">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border/40 p-6 min-h-[300px] flex items-center justify-center bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <p className="text-muted-foreground text-sm relative z-10">
          Área de gráficos e conteúdo — em breve
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;

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
      {/* Header with glow accent */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-blue-400 bg-clip-text text-transparent">
            Embalsoft Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visão geral dos seus indicadores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl p-5 transition-all duration-300 group
              bg-gradient-to-br from-card to-card/80 border border-primary/10 hover:border-primary/40 hover:glow-primary
              animate-fade-in-up-delay-${i + 1}`}
          >
            {/* Ambient glow */}
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-primary/8 group-hover:bg-primary/15 blur-2xl transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shadow-[0_0_12px_hsl(197_78%_52%/0.15)] group-hover:shadow-[0_0_20px_hsl(197_78%_52%/0.3)]">
                  <stat.icon size={16} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-primary mt-1 font-semibold drop-shadow-[0_0_6px_hsl(197_78%_52%/0.4)]">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-primary/10 p-6 min-h-[300px] flex items-center justify-center bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/3" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <p className="text-muted-foreground text-sm relative z-10">
          Área de gráficos e conteúdo — em breve
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;

import { BarChart3, Users, FileText, TrendingUp, CheckCircle2, Clock, AlertTriangle, AlertCircle, Headphones, RotateCcw, Code2, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// ── Mock Data ──

const stats = [
  { label: "Receita Total", value: "R$ 124.500", change: "+12.5%", up: true, icon: TrendingUp, tip: "Receita acumulada no período atual" },
  { label: "Clientes Ativos", value: "1.284", change: "+3.2%", up: true, icon: Users, tip: "Clientes com contrato ativo" },
  { label: "Relatórios", value: "48", change: "+8", up: true, icon: BarChart3, tip: "Relatórios gerados neste mês" },
  { label: "Documentos", value: "312", change: "+24", up: true, icon: FileText, tip: "Total de documentos processados" },
];

const implantacoes = [
  { cliente: "Ind. Nova Era", etapa: "Go-live", progresso: 95, status: "em_dia" as const, responsavel: "Carlos" },
  { cliente: "Distribuidora Sol", etapa: "Testes", progresso: 70, status: "atencao" as const, responsavel: "Ana" },
  { cliente: "Metalúrgica Forte", etapa: "Configuração", progresso: 40, status: "em_dia" as const, responsavel: "Pedro" },
  { cliente: "Alimentos Vida", etapa: "Início", progresso: 15, status: "atrasado" as const, responsavel: "Julia" },
];

const etapas = ["Início", "Configuração", "Testes", "Go-live"];

const statusConfig = {
  em_dia: { color: "text-emerald-400", bg: "bg-emerald-400/15", border: "border-emerald-400/30", label: "Em dia", icon: CheckCircle2 },
  atencao: { color: "text-amber-400", bg: "bg-amber-400/15", border: "border-amber-400/30", label: "Atenção", icon: Clock },
  atrasado: { color: "text-red-400", bg: "bg-red-400/15", border: "border-red-400/30", label: "Atrasado", icon: AlertTriangle },
};

const progressColor = {
  em_dia: "[&>div]:bg-emerald-400",
  atencao: "[&>div]:bg-amber-400",
  atrasado: "[&>div]:bg-red-400",
};

const revenueData = [
  { month: "Jan", receita: 85000 },
  { month: "Fev", receita: 92000 },
  { month: "Mar", receita: 88000 },
  { month: "Abr", receita: 105000 },
  { month: "Mai", receita: 112000 },
  { month: "Jun", receita: 124500 },
];

const devData = [
  { week: "S1", entregas: 32, retrabalho: 8 },
  { week: "S2", entregas: 40, retrabalho: 5 },
  { week: "S3", entregas: 38, retrabalho: 7 },
  { week: "S4", entregas: 45, retrabalho: 4 },
];

const supportData = [
  { week: "S1", atendimentos: 120 },
  { week: "S2", atendimentos: 145 },
  { week: "S3", atendimentos: 132 },
  { week: "S4", atendimentos: 158 },
];

const revenueChartConfig: ChartConfig = {
  receita: { label: "Receita", color: "hsl(197 78% 52%)" },
};

const devChartConfig: ChartConfig = {
  entregas: { label: "Entregas", color: "hsl(197 78% 52%)" },
  retrabalho: { label: "Retrabalho", color: "hsl(0 84% 60%)" },
};

const supportChartConfig: ChartConfig = {
  atendimentos: { label: "Atendimentos", color: "hsl(197 78% 52%)" },
};

// ── Helper ──

const InfoTip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info size={14} className="text-muted-foreground hover:text-primary transition-colors cursor-help" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[200px] text-xs">
      {text}
    </TooltipContent>
  </Tooltip>
);

const SectionTitle = ({ children, tip }: { children: React.ReactNode; tip?: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <h2 className="text-lg font-semibold">{children}</h2>
    {tip && <InfoTip text={tip} />}
  </div>
);

// ── Component ──

const DashboardHome = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <p className="text-muted-foreground text-sm relative z-10">
            Visão geral dos indicadores
          </p>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-xl p-5 transition-all duration-300 group
                bg-gradient-to-br from-card to-card/80 border border-primary/10 hover:border-primary/40 hover:glow-primary
                animate-fade-in-up-delay-${i + 1}`}
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-primary/8 group-hover:bg-primary/15 blur-2xl transition-all duration-500" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <InfoTip text={stat.tip} />
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shadow-[0_0_12px_hsl(197_78%_52%/0.15)] group-hover:shadow-[0_0_20px_hsl(197_78%_52%/0.3)]">
                    <stat.icon size={16} className="text-primary group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-xs mt-1 font-semibold ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.up ? "↑" : "↓"} {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Revenue Evolution Chart ── */}
        <div className="relative overflow-hidden rounded-xl border border-primary/10 p-6 bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="relative z-10">
            <SectionTitle tip="Evolução da receita nos últimos 6 meses">📈 Evolução da Receita</SectionTitle>
            <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="gradientReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(197 78% 52%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(197 78% 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 18%)" />
                <XAxis dataKey="month" stroke="hsl(218 11% 60%)" fontSize={12} />
                <YAxis stroke="hsl(218 11% 60%)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="receita" stroke="hsl(197 78% 52%)" strokeWidth={2} fill="url(#gradientReceita)" />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* ── Implantações em Andamento ── */}
        <div className="relative overflow-hidden rounded-xl border border-primary/10 p-6 bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="relative z-10">
            <SectionTitle tip="Acompanhe o progresso dos projetos de implantação em tempo real">🧩 Implantações em Andamento</SectionTitle>
            <div className="space-y-4">
              {implantacoes.map((item) => {
                const s = statusConfig[item.status];
                const StatusIcon = s.icon;
                const etapaIndex = etapas.indexOf(item.etapa);
                return (
                  <div
                    key={item.cliente}
                    className={`rounded-lg border ${s.border} ${s.bg} p-4 transition-all duration-300 hover:glow-primary`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <StatusIcon size={16} className={s.color} />
                        <span className="font-semibold truncate">{item.cliente}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.bg} ${s.color} border ${s.border}`}>
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{item.responsavel}</span>
                        <span className="font-bold text-foreground">{item.progresso}%</span>
                      </div>
                    </div>
                    {/* Timeline steps */}
                    <div className="flex items-center gap-1 mb-3">
                      {etapas.map((etapa, idx) => {
                        const isCompleted = idx <= etapaIndex;
                        const isCurrent = idx === etapaIndex;
                        return (
                          <div key={etapa} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div
                                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                                  isCurrent
                                    ? `${s.color} border-current shadow-[0_0_8px_currentColor]`
                                    : isCompleted
                                    ? `${s.color} border-current opacity-60`
                                    : "border-muted-foreground/30"
                                }`}
                                style={isCompleted ? { backgroundColor: "currentColor" } : {}}
                              />
                              <span className={`text-[10px] mt-1 ${isCurrent ? s.color + " font-semibold" : "text-muted-foreground"}`}>
                                {etapa}
                              </span>
                            </div>
                            {idx < etapas.length - 1 && (
                              <div className={`h-px flex-1 mx-1 ${isCompleted ? s.color.replace("text-", "bg-") + " opacity-40" : "bg-muted-foreground/20"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <Progress value={item.progresso} className={`h-1.5 bg-muted ${progressColor[item.status]}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Performance Operacional ── */}
        <div className="relative z-10">
          <SectionTitle tip="Indicadores de performance das equipes de desenvolvimento e suporte">📊 Performance Operacional</SectionTitle>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Desenvolvimento */}
          <div className="relative overflow-hidden rounded-xl border border-primary/10 p-6 bg-card">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Code2 size={18} className="text-primary" />
                <h3 className="font-semibold">Desenvolvimento</h3>
              </div>
              {/* Dev KPIs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-muted/30 border border-primary/10 p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-muted-foreground">Entregas realizadas</span>
                    <InfoTip text="Requisições finalizadas no período" />
                  </div>
                  <p className="text-2xl font-bold">155</p>
                  <p className="text-xs text-emerald-400 font-semibold">↑ +18% vs anterior</p>
                </div>
                <div className="rounded-lg bg-muted/30 border border-primary/10 p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-muted-foreground">Retrabalho</span>
                    <InfoTip text="Percentual de tarefas que voltaram para correção" />
                  </div>
                  <p className="text-2xl font-bold text-amber-400">8.5%</p>
                  <p className="text-xs text-emerald-400 font-semibold">↓ -2.1% vs anterior</p>
                </div>
              </div>
              {/* Dev Chart */}
              <ChartContainer config={devChartConfig} className="h-[180px] w-full">
                <BarChart data={devData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 18%)" />
                  <XAxis dataKey="week" stroke="hsl(218 11% 60%)" fontSize={12} />
                  <YAxis stroke="hsl(218 11% 60%)" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="entregas" fill="hsl(197 78% 52%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="retrabalho" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          {/* Suporte */}
          <div className="relative overflow-hidden rounded-xl border border-primary/10 p-6 bg-card">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Headphones size={18} className="text-primary" />
                <h3 className="font-semibold">Suporte</h3>
              </div>
              {/* Support KPI */}
              <div className="rounded-lg bg-muted/30 border border-primary/10 p-3 mb-4">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs text-muted-foreground">Atendimentos realizados</span>
                  <InfoTip text="Total de chamados atendidos no período" />
                </div>
                <p className="text-2xl font-bold">555</p>
                <p className="text-xs text-emerald-400 font-semibold">↑ +12% vs anterior</p>
              </div>
              {/* Support Chart */}
              <ChartContainer config={supportChartConfig} className="h-[180px] w-full">
                <LineChart data={supportData}>
                  <defs>
                    <linearGradient id="gradientSupport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(197 78% 52%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(197 78% 52%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 18%)" />
                  <XAxis dataKey="week" stroke="hsl(218 11% 60%)" fontSize={12} />
                  <YAxis stroke="hsl(218 11% 60%)" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="atendimentos" stroke="hsl(197 78% 52%)" strokeWidth={2} dot={{ fill: "hsl(197 78% 52%)", r: 4 }} />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardHome;

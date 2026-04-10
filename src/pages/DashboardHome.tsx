import { CheckCircle2, Clock, AlertTriangle, Code2, Headphones, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// ── Mock Data ──

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

const devChartConfig: ChartConfig = {
  entregas: { label: "Entregas", color: "hsl(197 78% 52%)" },
  retrabalho: { label: "Retrabalho", color: "hsl(0 84% 60%)" },
};

const supportChartConfig: ChartConfig = {
  atendimentos: { label: "Atendimentos", color: "hsl(197 78% 52%)" },
};

// ── Helpers ──

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

        {/* ── Performance Operacional ── */}
        <SectionTitle tip="Indicadores de performance das equipes de desenvolvimento e suporte">📊 Performance Operacional</SectionTitle>

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
              <div className="rounded-lg bg-muted/30 border border-primary/10 p-3 mb-4">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs text-muted-foreground">Atendimentos realizados</span>
                  <InfoTip text="Total de chamados atendidos no período" />
                </div>
                <p className="text-2xl font-bold">555</p>
                <p className="text-xs text-emerald-400 font-semibold">↑ +12% vs anterior</p>
              </div>
              <ChartContainer config={supportChartConfig} className="h-[180px] w-full">
                <LineChart data={supportData}>
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
      </div>
    </TooltipProvider>
  );
};

export default DashboardHome;

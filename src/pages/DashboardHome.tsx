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

import OrbitalBackground from "@/components/OrbitalBackground";

// ── Mock Data ──

const comercialData = {
  novosERP: { count: 12, growth: "+15%" },
  novosFabrica: { count: 5, growth: "+8%" }
};

const avancosData = [
  { projeto: "CRM 2.0", progresso: 80, cor: "bg-[#a7c64f]" },
  { projeto: "Novo App WMS", progresso: 65, cor: "bg-[#38b6ff]" },
  { projeto: "Integração B2B", progresso: 40, cor: "bg-[#b955a0]" },
];

const implantacoes = [
  { cliente: "Ind. Nova Era", etapa: "Go-live", progresso: 95, status: "em_dia" as const, responsavel: "Carlos" },
  { cliente: "Distribuidora Sol", etapa: "Testes", progresso: 70, status: "atencao" as const, responsavel: "Ana" },
  { cliente: "Metalúrgica Forte", etapa: "Configuração", progresso: 40, status: "em_dia" as const, responsavel: "Pedro" },
  { cliente: "Alimentos Vida", etapa: "Início", progresso: 15, status: "atrasado" as const, responsavel: "Julia" },
];

const etapas = ["Início", "Configuração", "Testes", "Go-live"];

const statusConfig = {
  em_dia: { color: "text-[#a7c64f]", bg: "bg-[#a7c64f]/15", border: "border-[#a7c64f]/30", label: "Em dia", icon: CheckCircle2 },
  atencao: { color: "text-[#f48121]", bg: "bg-[#f48121]/15", border: "border-[#f48121]/30", label: "Atenção", icon: Clock },
  atrasado: { color: "text-red-400", bg: "bg-red-400/15", border: "border-red-400/30", label: "Atrasado", icon: AlertTriangle },
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
  entregas: { label: "Entregas", color: "#38b6ff" },
  retrabalho: { label: "Retrabalho", color: "#f48121" },
};

const supportChartConfig: ChartConfig = {
  atendimentos: { label: "Atendimentos", color: "#b955a0" },
};

// ── Component ──

const DashboardHome = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative min-h-[calc(100vh-4rem)]">
        
        {/* Fundo Espacial Tech (HUD Backdrop) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden mix-blend-screen">
          <OrbitalBackground />
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none bg-background/60 backdrop-blur-sm" />

        {/* Conteúdo HUD Interativo */}
        <div className="relative z-10 space-y-6 animate-fade-in-up pb-8">

          {/* ── Linha 1: Painéis Principais (Comercial & Avanços) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            
            {/* HUD: Painel Comercial */}
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#f48121]/80 transition-all duration-300 hover:shadow-[0_0_25px_rgba(244,129,33,0.3)] flex flex-col">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#f48121]/20 blur-2xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-[#f48121] rounded-sm shadow-[0_0_12px_#f48121]" />
                <h3 className="font-mono text-base font-bold tracking-[0.2em] text-[#f48121] uppercase drop-shadow-md">PAINEL COMERCIAL</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* ERP */}
                <div className="border border-white/10 bg-black/60 p-5 rounded-lg flex flex-col justify-between group-hover:border-[#f48121]/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 4h16v16H4z"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold font-mono text-white/90 uppercase tracking-wider block mb-2 drop-shadow-md">Novos Clientes ERP</span>
                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-5xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{comercialData.novosERP.count}</span>
                      <span className="text-sm lg:text-base font-bold text-[#a7c64f] font-mono p-1 bg-[#a7c64f]/10 rounded border border-[#a7c64f]/30">{comercialData.novosERP.growth}</span>
                    </div>
                  </div>
                </div>
                {/* Fábrica */}
                <div className="border border-white/10 bg-black/60 p-5 rounded-lg flex flex-col justify-between group-hover:border-[#38b6ff]/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-2">
                    <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 20h16v-16H4z"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold font-mono text-white/90 uppercase tracking-wider block mb-2 drop-shadow-md">Fábrica de Software</span>
                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-5xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{comercialData.novosFabrica.count}</span>
                      <span className="text-sm lg:text-base font-bold text-[#a7c64f] font-mono p-1 bg-[#a7c64f]/10 rounded border border-[#a7c64f]/30">{comercialData.novosFabrica.growth}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HUD: Avanços/Conquistas */}
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#a7c64f]/80 transition-all duration-300 hover:shadow-[0_0_25px_rgba(167,198,79,0.3)] flex flex-col">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#a7c64f]/20 blur-2xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-[#a7c64f] rounded-sm shadow-[0_0_12px_#a7c64f]" />
                <h3 className="font-mono text-base font-bold tracking-[0.2em] text-[#a7c64f] uppercase drop-shadow-md">AVANÇOS E CONQUISTAS</h3>
              </div>

              <div className="space-y-6 flex-1 flex flex-col justify-center">
                {avancosData.map((avanco, idx) => (
                  <div key={idx} className="relative z-10 w-full">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm lg:text-base font-bold font-mono text-white tracking-wider drop-shadow-md">{avanco.projeto}</span>
                      <span className="text-base font-bold font-mono text-white/90">{avanco.progresso}%</span>
                    </div>
                    <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden border border-white/20 shadow-inner">
                      <div 
                        className={`h-full ${avanco.cor} relative shadow-[0_0_10px_currentColor]`} 
                        style={{ width: `${avanco.progresso}%`, transition: 'width 1s ease-in-out' }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/60 blur-[2px]" />
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Linha 2: Operacional ── */}
          <div className="flex items-center gap-3 mt-10 mb-6">
            <div className="w-2 h-6 bg-[#38b6ff] rounded-sm shadow-[0_0_12px_#38b6ff]" />
            <h3 className="font-mono text-base font-bold tracking-[0.2em] text-[#38b6ff] uppercase drop-shadow-md">PERFORMANCE OPERACIONAL</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Desenvolvimento */}
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#38b6ff]/80 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-20 drop-shadow-lg">
                <Code2 size={60} className="text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg bg-black/60 border border-white/10 p-5 flex flex-col justify-center">
                  <span className="text-xs font-bold font-mono text-white/90 uppercase tracking-widest drop-shadow-md">Entregas Realizadas</span>
                  <p className="text-5xl font-bold text-white mt-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">155</p>
                </div>
                <div className="rounded-lg bg-black/60 border border-white/10 p-5 flex flex-col justify-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f48121] to-transparent shadow-[0_0_10px_#f48121]" />
                  <span className="text-xs font-bold font-mono text-white/90 uppercase tracking-widest drop-shadow-md">Retrabalho</span>
                  <p className="text-5xl font-bold text-[#f48121] mt-3 drop-shadow-[0_0_15px_rgba(244,129,33,0.7)]">8.5%</p>
                </div>
              </div>
              <ChartContainer config={devChartConfig} className="h-[220px] w-full mt-4">
                <BarChart data={devData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.7)" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="entregas" fill="#38b6ff" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="retrabalho" fill="#f48121" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Suporte */}
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#b955a0]/80 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-20 drop-shadow-lg">
                <Headphones size={60} className="text-white" />
              </div>
              <div className="rounded-lg bg-black/60 border border-white/10 p-5 mb-6 inline-block pr-16 shadow-lg">
                <span className="text-xs font-bold font-mono text-white/90 uppercase tracking-widest drop-shadow-md block mb-3">Chamados Atendidos</span>
                <p className="text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] flex items-baseline gap-4">
                  555 
                  <span className="text-lg font-bold text-[#a7c64f] p-1 bg-[#a7c64f]/10 rounded border border-[#a7c64f]/30">↑12%</span>
                </p>
              </div>
              <ChartContainer config={supportChartConfig} className="h-[220px] w-full mt-4">
                <LineChart data={supportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.7)" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="atendimentos" stroke="#b955a0" strokeWidth={5} dot={{ fill: "#b955a0", r: 6, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 9, fill: "#fff", stroke: "#b955a0", strokeWidth: 3 }} />
                </LineChart>
              </ChartContainer>
            </div>
          </div>

          {/* ── Implantações em Andamento ── */}
          <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] mt-10 group hover:border-white/40 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-white/90 rounded-sm shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
              <h3 className="font-mono text-base font-bold tracking-[0.2em] text-white uppercase drop-shadow-md">IMPLANTAÇÕES ATIVAS</h3>
            </div>
            
            <div className="space-y-5">
              {implantacoes.map((item) => {
                const s = statusConfig[item.status];
                const StatusIcon = s.icon;
                const etapaIndex = etapas.indexOf(item.etapa);
                return (
                  <div
                    key={item.cliente}
                    className="relative rounded-lg border-2 border-white/10 bg-black/60 p-5 transition-all duration-300 hover:border-white/30 overflow-hidden shadow-md"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" }} />
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 pl-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <StatusIcon size={20} className={s.color} />
                        <span className="font-mono text-lg font-bold tracking-wide text-white truncate drop-shadow-sm">{item.cliente}</span>
                        <span className={`text-xs uppercase font-bold font-mono px-3 py-1 rounded border-2 ${s.border} ${s.color} shadow-sm`}>
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm font-bold font-mono text-white/90">
                        <span className="uppercase tracking-widest bg-white/10 px-3 py-1 rounded-sm border border-white/10">RESP: {item.responsavel}</span>
                        <span className="text-xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{item.progresso}%</span>
                      </div>
                    </div>
                    {/* Linha do tempo (progress bar com steps engrossada) */}
                    <div className="flex items-center px-4 relative">
                      {etapas.map((etapa, idx) => {
                        const isCompleted = idx <= etapaIndex;
                        const isCurrent = idx === etapaIndex;
                        const mainColor = isCurrent ? s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" : (isCompleted ? s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" : "rgba(255,255,255,0.15)");
                        
                        return (
                          <div key={etapa} className="flex-1 relative flex flex-col pt-2">
                            <div className="relative flex items-center mb-3">
                               <div 
                                className={`w-4 h-4 rounded-sm z-10 transition-all ${isCurrent ? 'shadow-[0_0_15px_currentColor] scale-125' : ''}`}
                                style={{ backgroundColor: mainColor, transform: 'rotate(45deg)' }}
                               />
                               {idx < etapas.length - 1 && (
                                <div className="absolute left-4 right-0 h-1 bg-white/10 z-0 rounded-full" />
                               )}
                               {idx < etapas.length - 1 && isCompleted && (
                                <div className="absolute left-4 right-0 h-1 z-0 shadow-[0_0_8px_currentColor] rounded-full" style={{ backgroundColor: mainColor }} />
                               )}
                            </div>
                            <span className={`text-xs uppercase font-bold font-mono whitespace-nowrap -ml-2 drop-shadow-sm ${isCurrent ? 'text-white' : 'text-white/60'}`}>
                              {etapa}
                            </span>
                          </div>
                        );
                      })}
                    </div>
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

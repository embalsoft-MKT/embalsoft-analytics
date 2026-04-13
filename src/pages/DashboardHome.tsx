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
            <div className="relative overflow-hidden rounded-xl border border-white/10 p-5 bg-card/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] group hover:border-[#f48121]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,129,33,0.15)] flex flex-col">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#f48121]/10 blur-xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-[#f48121] rounded-sm shadow-[0_0_8px_#f48121]" />
                <h3 className="font-mono text-sm tracking-widest text-[#f48121] uppercase">PAINEL COMERCIAL</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* ERP */}
                <div className="border border-white/5 bg-black/40 p-4 rounded-lg flex flex-col justify-between group-hover:border-[#f48121]/30 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1">
                    <svg className="w-4 h-4 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/></svg>
                  </div>
                  <div>
                    <span className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Novos Clientes ERP</span>
                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-3xl md:text-4xl font-light tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{comercialData.novosERP.count}</span>
                      <span className="text-xs text-[#a7c64f] font-mono mb-1">{comercialData.novosERP.growth}</span>
                    </div>
                  </div>
                </div>
                {/* Fábrica */}
                <div className="border border-white/5 bg-black/40 p-4 rounded-lg flex flex-col justify-between group-hover:border-[#38b6ff]/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-1">
                    <svg className="w-4 h-4 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h16v-16H4z"/></svg>
                  </div>
                  <div>
                    <span className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Fábrica de Software</span>
                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-3xl md:text-4xl font-light tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{comercialData.novosFabrica.count}</span>
                      <span className="text-xs text-[#a7c64f] font-mono mb-1">{comercialData.novosFabrica.growth}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HUD: Avanços/Conquistas */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 p-5 bg-card/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] group hover:border-[#a7c64f]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(167,198,79,0.15)] flex flex-col">
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#a7c64f]/10 blur-xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-[#a7c64f] rounded-sm shadow-[0_0_8px_#a7c64f]" />
                <h3 className="font-mono text-sm tracking-widest text-[#a7c64f] uppercase">AVANÇOS E CONQUISTAS</h3>
              </div>

              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {avancosData.map((avanco, idx) => (
                  <div key={idx} className="relative z-10 w-full">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-mono text-foreground tracking-wider">{avanco.projeto}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{avanco.progresso}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full ${avanco.cor} relative`} 
                        style={{ width: `${avanco.progresso}%` }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[1px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Linha 2: Operacional ── */}
          <div className="flex items-center gap-2 mt-8 mb-4">
            <div className="w-1.5 h-4 bg-[#38b6ff] rounded-sm shadow-[0_0_8px_#38b6ff]" />
            <h3 className="font-mono text-sm tracking-widest text-[#38b6ff] uppercase">PERFORMANCE OPERACIONAL</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Desenvolvimento */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 p-5 bg-card/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] group hover:border-[#38b6ff]/50 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Code2 size={40} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-black/40 border border-white/5 p-3 flex-1 flex flex-col">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Entregas Realizadas</span>
                  <p className="text-2xl font-light text-white mt-1">155</p>
                </div>
                <div className="rounded-lg bg-black/40 border border-white/5 p-3 flex-1 flex flex-col relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f48121]/40 to-transparent" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Retrabalho</span>
                  <p className="text-2xl font-light text-[#f48121] mt-1 drop-shadow-[0_0_5px_rgba(244,129,33,0.5)]">8.5%</p>
                </div>
              </div>
              <ChartContainer config={devChartConfig} className="h-[180px] w-full mt-2">
                <BarChart data={devData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="entregas" fill="#38b6ff" radius={[2, 2, 0, 0]} barSize={12} />
                  <Bar dataKey="retrabalho" fill="#f48121" radius={[2, 2, 0, 0]} barSize={12} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Suporte */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 p-5 bg-card/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] group hover:border-[#b955a0]/50 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Headphones size={40} />
              </div>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 mb-4 inline-block pr-12">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Chamados Atendidos</span>
                <p className="text-2xl font-light text-white mt-1">555 <span className="text-[10px] text-[#a7c64f] opacity-80">↑12%</span></p>
              </div>
              <ChartContainer config={supportChartConfig} className="h-[180px] w-full mt-2">
                <LineChart data={supportData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="atendimentos" stroke="#b955a0" strokeWidth={2} dot={{ fill: "#b955a0", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#fff", stroke: "#b955a0", strokeWidth: 2 }} />
                </LineChart>
              </ChartContainer>
            </div>
          </div>

          {/* ── Implantações em Andamento ── */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 p-5 bg-card/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-6 group hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-4 bg-white/70 rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              <h3 className="font-mono text-sm tracking-widest text-white/90 uppercase">IMPLANTAÇÕES ATIVAS</h3>
            </div>
            
            <div className="space-y-4">
              {implantacoes.map((item) => {
                const s = statusConfig[item.status];
                const StatusIcon = s.icon;
                const etapaIndex = etapas.indexOf(item.etapa);
                return (
                  <div
                    key={item.cliente}
                    className="relative rounded-lg border border-white/5 bg-black/40 p-4 transition-all duration-300 hover:border-white/15 overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" }} />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 pl-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <StatusIcon size={14} className={s.color} />
                        <span className="font-mono text-sm tracking-wide text-foreground truncate">{item.cliente}</span>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${s.border} ${s.color}`}>
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                        <span className="uppercase opacity-70">RESP: {item.responsavel}</span>
                        <span className="text-white bg-white/10 px-2 py-0.5 rounded">{item.progresso}%</span>
                      </div>
                    </div>
                    {/* Linha do tempo (progress bar com steps) */}
                    <div className="flex items-center px-2">
                      {etapas.map((etapa, idx) => {
                        const isCompleted = idx <= etapaIndex;
                        const isCurrent = idx === etapaIndex;
                        const mainColor = isCurrent ? s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" : (isCompleted ? s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" : "rgba(255,255,255,0.1)");
                        
                        return (
                          <div key={etapa} className="flex-1 relative flex flex-col">
                            <div className="relative flex items-center mb-1">
                               <div 
                                className={`w-2.5 h-2.5 rounded-sm z-10 transition-all ${isCurrent ? 'shadow-[0_0_8px_currentColor]' : ''}`}
                                style={{ backgroundColor: mainColor, transform: 'rotate(45deg)' }}
                               />
                               {idx < etapas.length - 1 && (
                                <div className="absolute left-2.5 right-0 h-px bg-white/5 z-0" />
                               )}
                               {idx < etapas.length - 1 && isCompleted && (
                                <div className="absolute left-2.5 right-0 h-px z-0 opacity-40 shadow-[0_0_5px_currentColor]" style={{ backgroundColor: mainColor }} />
                               )}
                            </div>
                            <span className="text-[9px] uppercase font-mono text-muted-foreground/70 mt-1 whitespace-nowrap">
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

import { CheckCircle2, Clock, AlertTriangle, Code2, Headphones, Info, Download, Edit2, Loader2, Check, X, Save, User as UserIcon } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useIndicadores } from "@/hooks/useIndicadores";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// ── Mock Data ──

// Mock dos avanços
const avancosData = [
  { projeto: "Embalsoft CRM 2.0", progresso: 80, cor: "bg-[#a7c64f]" },
  { projeto: "BI Nativo do ERP", progresso: 15, cor: "bg-[#38b6ff]" },
  { projeto: "Agentes de IA", progresso: 5, cor: "bg-[#38b6ff]" },
];

// Painel Comercial (fictício)
const erp = { valor: 12, valor_extra: "+15%" };
const fab = { valor: 8, valor_extra: "+10%" };

// Performance Operacional (fictício)
const entregas = { valor: 45 };
const retrabalho = { valor: 4, valor_extra: "%" };
const chamados = { valor: 158, valor_extra: "+8%" };

const implantacoes = [
  { cliente: "Ind. Nova Era", etapa: "Go Live", progresso: 100, status: "em_dia" as const, responsavel: "Marcos" },
  { cliente: "Distribuidora Sol", etapa: "Testes", progresso: 70, status: "atencao" as const, responsavel: "Renan" },
  { cliente: "Metalúrgica Forte", etapa: "Imersão Geral", progresso: 35, status: "em_dia" as const, responsavel: "Marcos" },
  { cliente: "Alimentos Vida", etapa: "Kick-off", progresso: 10, status: "atrasado" as const, responsavel: "Renan" },
];

const etapas = ["Kick-off", "Levantamento", "Imersão Geral", "Configuração", "Treinamento", "Testes", "Simulado", "Go Live"];

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
  atendimentos: { label: "Atendimentos", color: "#38b6ff" },
};

// ── Component ──

const EditableIndicator = ({ chave, defaultLabel, defaultValorExtra, layout, groupHoverBorder }: { 
  chave: string, 
  defaultLabel: string, 
  defaultValorExtra?: string,
  layout: "commercial" | "operacional" | "retrabalho" | "suporte",
  groupHoverBorder?: string 
}) => {
  const { isAdmin } = useAuth();
  const { byChave, updateIndicador } = useIndicadores();
  const indicador = byChave(chave);

  const [editing, setEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftValor, setDraftValor] = useState("");
  const [draftExtra, setDraftExtra] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (indicador) {
      setDraftLabel(indicador.label || defaultLabel);
      setDraftValor(indicador.valor?.toString() ?? "");
      setDraftExtra(indicador.valor_extra ?? "");
    } else {
      setDraftLabel(defaultLabel);
      setDraftExtra(defaultValorExtra || "");
    }
  }, [indicador, defaultLabel, defaultValorExtra]);

  const handleEdit = () => {
    if (!isAdmin) return;
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (indicador) {
      setDraftLabel(indicador.label || defaultLabel);
      setDraftValor(indicador.valor?.toString() ?? "");
      setDraftExtra(indicador.valor_extra ?? "");
    }
  };

  const handleSave = async () => {
    if (!indicador) {
       toast.error("Indicador não encontrado no banco.");
       return;
    }
    setSaving(true);
    try {
      const num = draftValor === "" ? null : Number(draftValor);
      if (num !== null && Number.isNaN(num)) throw new Error("Valor inválido");
      if (!draftLabel.trim()) throw new Error("Título não pode ser vazio");
      
      await updateIndicador(indicador.id, num, draftExtra || null, draftLabel);
      toast.success("Indicador atualizado!");
      setEditing(false);
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar indicador");
    } finally {
      setSaving(false);
    }
  };

  const displayLabel = indicador?.label || defaultLabel;
  const displayValor = indicador?.valor ?? "—";
  const displayExtra = indicador?.valor_extra ?? defaultValorExtra ?? "";

  if (editing) {
    return (
      <div className="border border-[#38b6ff]/40 bg-black/80 p-4 rounded-lg flex flex-col justify-between relative shadow-[0_0_15px_rgba(56,182,255,0.15)] animate-fade-in w-full h-full min-h-[140px]">
        <div className="space-y-2 flex-1">
           <input 
             value={draftLabel}
             onChange={e => setDraftLabel(e.target.value)}
             className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-xs font-bold font-sans text-white/90 uppercase tracking-wider focus:border-[#38b6ff] outline-none"
             placeholder="Título"
           />
           <div className="flex gap-2">
             <input 
               type="number"
               step="0.1"
               value={draftValor}
               onChange={e => setDraftValor(e.target.value)}
               className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-lg font-bold text-white focus:border-[#38b6ff] outline-none"
               placeholder="Valor"
             />
             <input 
               value={draftExtra}
               onChange={e => setDraftExtra(e.target.value)}
               className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-sm font-bold text-[#a7c64f] focus:border-[#38b6ff] outline-none"
               placeholder="Extra (%)"
             />
           </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-2">
           <div className="text-[9px] text-white/30 flex items-center gap-1">
             {indicador?.updated_at && <><Clock size={9}/> {new Date(indicador.updated_at).toLocaleDateString('pt-BR')}</>}
           </div>
           <div className="flex gap-2">
             <button onClick={handleCancel} disabled={saving} className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X size={14}/></button>
             <button onClick={handleSave} disabled={saving} className="p-1 rounded bg-[#a7c64f]/20 hover:bg-[#a7c64f]/40 text-[#a7c64f] transition-colors">
               {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14}/>}
             </button>
           </div>
        </div>
      </div>
    );
  }

  // View Mode Renders
  const renderEditButton = () => isAdmin && (
    <button 
      onClick={handleEdit}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 opacity-40 group-hover:opacity-100 transition-opacity hover:bg-white/15 text-white/70 hover:text-white z-20"
      title="Editar"
    >
      <Edit2 size={14} />
    </button>
  );

  const renderFooterInfo = () => isAdmin && indicador?.updated_at && (
    <div className="absolute bottom-2 right-2 text-[9px] text-white/40 opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-20">
      <UserIcon size={9}/> {indicador.updated_by_name || 'Admin'}
    </div>
  );

  if (layout === "commercial") {
    return (
      <div className={`border border-white/10 bg-black/60 p-5 rounded-lg flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${groupHoverBorder}`}>
        {renderEditButton()}
        <div>
          <span className="text-sm font-bold font-sans text-white/90 uppercase tracking-wider block mb-2 drop-shadow-md pr-8">{displayLabel}</span>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-5xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{displayValor}</span>
            <span className="text-sm lg:text-base font-bold text-[#a7c64f] font-sans p-1 bg-[#a7c64f]/10 rounded border border-[#a7c64f]/30">{displayExtra}</span>
          </div>
        </div>
        {renderFooterInfo()}
      </div>
    );
  }

  if (layout === "operacional") {
    return (
      <div className="rounded-lg bg-black/60 border border-white/10 p-5 flex flex-col justify-center relative group">
        {renderEditButton()}
        <span className="text-xs font-bold font-sans text-white/90 uppercase tracking-widest drop-shadow-md pr-8">{displayLabel}</span>
        <p className="text-5xl font-bold text-white mt-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{displayValor}</p>
        {renderFooterInfo()}
      </div>
    );
  }

  if (layout === "retrabalho") {
    return (
      <div className="rounded-lg bg-black/60 border border-white/10 p-5 flex flex-col justify-center relative overflow-hidden group">
        {renderEditButton()}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f48121] to-transparent shadow-[0_0_10px_#f48121]" />
        <span className="text-xs font-bold font-sans text-white/90 uppercase tracking-widest drop-shadow-md pr-8">{displayLabel}</span>
        <p className="text-5xl font-bold text-[#f48121] mt-3 drop-shadow-[0_0_15px_rgba(244,129,33,0.7)]">{displayValor}{displayExtra}</p>
        {renderFooterInfo()}
      </div>
    );
  }

  if (layout === "suporte") {
    return (
      <div className="rounded-lg bg-black/60 border border-white/10 p-5 mb-6 inline-block pr-16 shadow-lg relative group">
        {renderEditButton()}
        <span className="text-xs font-bold font-sans text-white/90 uppercase tracking-widest drop-shadow-md block mb-3 pr-8">{displayLabel}</span>
        <p className="text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] flex items-baseline gap-4">
          {displayValor}
          <span className="text-lg font-bold text-[#a7c64f] p-1 bg-[#a7c64f]/10 rounded border border-[#a7c64f]/30">{displayExtra}</span>
        </p>
        {renderFooterInfo()}
      </div>
    );
  }

  return null;
};

const DashboardHome = () => {
  const { isAdmin, profile } = useAuth();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative min-h-[calc(100vh-4rem)]">
        
        {/* DEBUG TEMPORÁRIO */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-black/80 border border-[#f48121] text-[#f48121] px-4 py-2 rounded-md text-xs font-mono flex gap-4 shadow-lg backdrop-blur-md">
           <span>LOGADO COMO: {profile?.full_name || 'Desconhecido'}</span>
           <span>ROLE: {profile?.role || 'Nenhuma'}</span>
           <span>IS_ADMIN: {isAdmin ? 'SIM' : 'NÃO'}</span>
        </div>

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
                <h3 className="font-sans text-base font-bold tracking-[0.2em] text-[#f48121] uppercase drop-shadow-md">PAINEL COMERCIAL</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* ERP */}
                <EditableIndicator 
                  chave="erp" 
                  defaultLabel="Novos Clientes ERP" 
                  defaultValorExtra="+15%"
                  layout="commercial" 
                  groupHoverBorder="group-hover:border-[#f48121]/50" 
                />
                {/* Fábrica */}
                <EditableIndicator 
                  chave="fabrica" 
                  defaultLabel="Fábrica de Software" 
                  defaultValorExtra="+10%"
                  layout="commercial" 
                  groupHoverBorder="group-hover:border-[#38b6ff]/50" 
                />
              </div>
            </div>

            {/* HUD: Avanços/Conquistas */}
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#a7c64f]/80 transition-all duration-300 hover:shadow-[0_0_25px_rgba(167,198,79,0.3)] flex flex-col">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#a7c64f]/20 blur-2xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-[#a7c64f] rounded-sm shadow-[0_0_12px_#a7c64f]" />
                <h3 className="font-sans text-base font-bold tracking-[0.2em] text-[#a7c64f] uppercase drop-shadow-md">AVANÇOS E CONQUISTAS</h3>
              </div>

              <div className="space-y-6 flex-1 flex flex-col justify-center">
                {avancosData.map((avanco, idx) => (
                  <div key={idx} className="relative z-10 w-full">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm lg:text-base font-bold font-sans text-white tracking-wider drop-shadow-md">{avanco.projeto}</span>
                      <span className="text-base font-bold font-sans text-white/90">{avanco.progresso}%</span>
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
          <div className="flex items-center justify-between mt-10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-[#38b6ff] rounded-sm shadow-[0_0_12px_#38b6ff]" />
              <h3 className="font-mono text-base font-bold tracking-[0.2em] text-[#38b6ff] uppercase drop-shadow-md">PERFORMANCE OPERACIONAL</h3>
            </div>
            <button className="flex items-center gap-2 text-xs font-sans font-bold text-white bg-black/50 border border-white/20 hover:border-[#38b6ff]/60 hover:bg-[#38b6ff]/20 px-3 py-2 rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer">
               <Download size={14} className="text-[#38b6ff]" />
               BAIXAR RELATÓRIO
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Desenvolvimento */}
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#38b6ff]/80 transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <Code2 size={18} className="text-[#38b6ff] drop-shadow-[0_0_8px_#38b6ff]" />
                <h4 className="font-sans text-sm font-bold tracking-[0.2em] text-[#38b6ff] uppercase drop-shadow-md">Desenvolvimento e QA</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <EditableIndicator 
                  chave="entregas" 
                  defaultLabel="Entregas Realizadas" 
                  layout="operacional" 
                />
                <EditableIndicator 
                  chave="retrabalho" 
                  defaultLabel="Retrabalho" 
                  defaultValorExtra="%"
                  layout="retrabalho" 
                />
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
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#38b6ff]/80 transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <Headphones size={18} className="text-[#38b6ff] drop-shadow-[0_0_8px_#38b6ff]" />
                <h4 className="font-sans text-sm font-bold tracking-[0.2em] text-[#38b6ff] uppercase drop-shadow-md">Suporte</h4>
              </div>
              <EditableIndicator 
                chave="chamados" 
                defaultLabel="Chamados Atendidos" 
                defaultValorExtra="+8%"
                layout="suporte" 
              />
              <ChartContainer config={supportChartConfig} className="h-[220px] w-full mt-4">
                <LineChart data={supportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.7)" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={13} fontWeight="bold" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="atendimentos" stroke="#38b6ff" strokeWidth={5} dot={{ fill: "#38b6ff", r: 6, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 9, fill: "#fff", stroke: "#38b6ff", strokeWidth: 3 }} />
                </LineChart>
              </ChartContainer>
            </div>
          </div>

          {/* ── Implantações em Andamento ── */}
          <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] mt-10 group hover:border-white/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-white/90 rounded-sm shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                <h3 className="font-mono text-base font-bold tracking-[0.2em] text-white uppercase drop-shadow-md">PROJETOS EM IMPLANTAÇÃO</h3>
              </div>
              <button className="flex items-center gap-2 text-xs font-sans font-bold text-white bg-black/50 border border-white/20 hover:border-[#38b6ff]/60 hover:bg-[#38b6ff]/20 px-3 py-2 rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer">
                 <Download size={14} className="text-[#38b6ff]" />
                 BAIXAR RELATÓRIO
              </button>
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
                        <span className="font-sans text-lg font-bold tracking-wide text-white truncate drop-shadow-sm">{item.cliente}</span>
                        <span className={`text-xs uppercase font-bold font-sans px-3 py-1 rounded border-2 ${s.border} ${s.color} shadow-sm`}>
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm font-bold font-sans text-white/90">
                        <span className="uppercase tracking-widest bg-white/10 px-3 py-1 rounded-sm border border-white/10">RESP: {item.responsavel}</span>
                        <span className="text-xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{item.progresso}%</span>
                      </div>
                    </div>
                    {/* Linha do tempo (progress bar com steps engrossada) */}
                    <div className="relative flex items-center px-4">
                      {/* Linha base contínua */}
                      <div className="absolute left-4 right-4 top-2 h-1 bg-white/10 rounded-full z-0" />
                      {/* Linha de progresso preenchida */}
                      <div
                        className="absolute left-4 top-2 h-1 rounded-full z-0 shadow-[0_0_8px_currentColor] transition-all duration-500"
                        style={{
                          width: etapaIndex >= 0 ? `calc((100% - 2rem) * ${etapaIndex / (etapas.length - 1)})` : '0%',
                          backgroundColor: s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor",
                        }}
                      />
                      {etapas.map((etapa, idx) => {
                        const isCompleted = idx <= etapaIndex;
                        const isCurrent = idx === etapaIndex;
                        const mainColor = isCompleted ? s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" : "rgba(255,255,255,0.15)";

                        return (
                          <div key={etapa} className="flex-1 relative flex flex-col items-center">
                            <div className="relative flex items-center justify-center w-full mb-3">
                               <div
                                className={`w-4 h-4 rounded-sm z-10 transition-all ${isCurrent ? 'shadow-[0_0_15px_currentColor] scale-125' : ''}`}
                                style={{ backgroundColor: mainColor, transform: 'rotate(45deg)' }}
                               />
                            </div>
                            <span className={`text-xs whitespace-nowrap font-bold font-sans drop-shadow-sm ${isCurrent ? 'text-white' : 'text-white/60'}`}>
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

import { CheckCircle2, Clock, AlertTriangle, Code2, Headphones, Info, Download, Edit2, Loader2, Check, X, Save, User as UserIcon, TrendingUp, TrendingDown, Plus, Trash2 } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import OrbitalBackground from "@/components/OrbitalBackground";
import { useAuth } from "@/contexts/AuthContext";
import { useIndicadores, fetchHistorico } from "@/hooks/useIndicadores";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// Botão de relatório padrão (desativado por enquanto)
const ReportButton = () => (
  <button
    disabled
    title="Em breve"
    className="flex items-center gap-2 text-[11px] font-sans font-bold text-white/60 bg-black/40 border border-white/15 px-2.5 py-1.5 rounded-md opacity-60 cursor-not-allowed"
  >
    <Download size={12} className="text-[#38b6ff]/70" />
    BAIXAR RELATÓRIO
  </button>
);

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

type ImplantacaoStatus = "em_dia" | "atencao" | "atrasado";
interface Implantacao {
  id?: string;
  cliente: string;
  etapa: string;
  status: ImplantacaoStatus;
  responsavel: string;
}

const implantacoesIniciais: Implantacao[] = [
  { cliente: "Ind. Nova Era", etapa: "Go Live", status: "em_dia", responsavel: "Marcos" },
  { cliente: "Distribuidora Sol", etapa: "Testes", status: "atencao", responsavel: "Renan" },
  { cliente: "Metalúrgica Forte", etapa: "Imersão Geral", status: "em_dia", responsavel: "Marcos" },
  { cliente: "Alimentos Vida", etapa: "Kick-off", status: "atrasado", responsavel: "Renan" },
];

const IMPLANTACOES_STORAGE_KEY = "embalconnect:implantacoes";

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

const EditableIndicator = ({ chave, defaultLabel, defaultValue, defaultValorExtra, layout, groupHoverBorder }: { 
  chave: string, 
  defaultLabel: string, 
  defaultValue: number,
  defaultValorExtra?: string,
  layout: "commercial" | "operacional" | "retrabalho" | "suporte",
  groupHoverBorder?: string 
}) => {
  const { isAdmin } = useAuth();
  const { byChave, updateIndicador } = useIndicadores();
  const indicador = byChave(chave);

  const [editing, setEditing] = useState(false);
  const [draftValor, setDraftValor] = useState("");
  const [saving, setSaving] = useState(false);
  const [prevValor, setPrevValor] = useState<number | null>(null);

  // Carrega o último valor anterior para calcular % automática
  useEffect(() => {
    if (!indicador) return;
    fetchHistorico(indicador.id)
      .then((h) => {
        const last = h.find((x) => x.valor_anterior !== null);
        setPrevValor(last?.valor_anterior ?? null);
      })
      .catch(() => setPrevValor(null));
  }, [indicador?.id, indicador?.updated_at]);

  useEffect(() => {
    if (indicador) {
      setDraftValor(indicador.valor !== null && indicador.valor !== undefined ? indicador.valor.toString() : defaultValue.toString());
    } else {
      setDraftValor(defaultValue.toString());
    }
  }, [indicador, defaultValue]);

  const handleEdit = () => {
    if (!isAdmin) return;
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (indicador) {
      setDraftValor(indicador.valor !== null && indicador.valor !== undefined ? indicador.valor.toString() : defaultValue.toString());
    } else {
      setDraftValor(defaultValue.toString());
    }
  };

  // Calcula porcentagem automática com base no histórico
  const computedExtra = (() => {
    if (layout === "retrabalho") return defaultValorExtra || "%";
    const atual = indicador?.valor ?? null;
    if (atual === null || prevValor === null || prevValor === 0) {
      return defaultValorExtra || "";
    }
    const pct = ((atual - prevValor) / Math.abs(prevValor)) * 100;
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct.toFixed(0)}%`;
  })();

  const handleSave = async () => {
    setSaving(true);
    try {
      const num = draftValor === "" ? null : Number(draftValor);
      if (num !== null && Number.isNaN(num)) throw new Error("Valor inválido");
      
      let categoria: "comercial" | "avancos" | "operacional" = "comercial";
      let ordem = 1;
      
      if (layout === "commercial") {
        categoria = "comercial";
        ordem = chave === "erp" ? 1 : 2;
      } else {
        categoria = "operacional";
        if (chave === "entregas") ordem = 1;
        else if (chave === "retrabalho") ordem = 2;
        else if (chave === "chamados") ordem = 3;
      }
      
      await updateIndicador(chave, num, computedExtra || null, displayLabel, categoria, ordem);
      toast.success("Salvo com sucesso!");
      setEditing(false);
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar indicador");
    } finally {
      setSaving(false);
    }
  };

  const displayLabel = indicador?.label || defaultLabel;
  const displayValor = indicador?.valor !== null && indicador?.valor !== undefined ? indicador.valor : defaultValue;
  const displayExtra = computedExtra;
  const isPositive = displayExtra.startsWith("+");
  const isNegative = displayExtra.startsWith("-");

  const renderEditButton = () => isAdmin && !editing && (
    <button 
      onClick={handleEdit}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 opacity-40 group-hover:opacity-100 transition-opacity hover:bg-white/15 text-white/70 hover:text-white z-20"
      title="Editar valor"
    >
      <Edit2 size={14} />
    </button>
  );

  const renderEditControls = () => (
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
  );

  const renderFooterInfo = () => isAdmin && indicador?.updated_at && !editing && (
    <div className="absolute bottom-2 right-2 text-[9px] text-white/40 opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-20">
      <UserIcon size={9}/> {indicador.updated_by_name || 'Admin'}
    </div>
  );

  const valorNode = editing ? (
    <input 
      type="number"
      step="0.1"
      autoFocus
      value={draftValor}
      onChange={e => setDraftValor(e.target.value)}
      className="w-32 bg-black/50 border border-[#38b6ff]/60 rounded px-2 py-1 text-3xl font-bold text-white focus:border-[#38b6ff] outline-none"
      placeholder="Valor"
    />
  ) : null;

  const extraBadgeClass = isNegative
    ? "text-[#f48121] bg-[#f48121]/10 border-[#f48121]/30"
    : "text-[#a7c64f] bg-[#a7c64f]/10 border-[#a7c64f]/30";

  if (layout === "commercial") {
    return (
      <div className={`border border-white/10 bg-black/60 p-5 rounded-lg flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${groupHoverBorder}`}>
        {renderEditButton()}
        <div>
          <span className="text-sm font-bold font-sans text-white/90 uppercase tracking-wider block mb-2 drop-shadow-md pr-8">{displayLabel}</span>
          <div className="flex items-baseline gap-3 mt-4">
            {editing ? valorNode : (
              <span className="text-5xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{displayValor}</span>
            )}
            {displayExtra && (
              <span className={`text-sm lg:text-base font-bold font-sans p-1 rounded border ${extraBadgeClass}`}>{displayExtra}</span>
            )}
          </div>
        </div>
        {editing ? renderEditControls() : renderFooterInfo()}
      </div>
    );
  }

  if (layout === "operacional") {
    return (
      <div className="rounded-lg bg-black/60 border border-white/10 p-5 flex flex-col justify-center relative group">
        {renderEditButton()}
        <span className="text-xs font-bold font-sans text-white/90 uppercase tracking-widest drop-shadow-md pr-8">{displayLabel}</span>
        {editing ? <div className="mt-3">{valorNode}</div> : (
          <p className="text-5xl font-bold text-white mt-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{displayValor}</p>
        )}
        {editing ? renderEditControls() : renderFooterInfo()}
      </div>
    );
  }

  if (layout === "retrabalho") {
    return (
      <div className="rounded-lg bg-black/60 border border-white/10 p-5 flex flex-col justify-center relative overflow-hidden group">
        {renderEditButton()}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f48121] to-transparent shadow-[0_0_10px_#f48121]" />
        <span className="text-xs font-bold font-sans text-white/90 uppercase tracking-widest drop-shadow-md pr-8">{displayLabel}</span>
        {editing ? <div className="mt-3">{valorNode}</div> : (
          <p className="text-5xl font-bold text-[#f48121] mt-3 drop-shadow-[0_0_15px_rgba(244,129,33,0.7)]">{displayValor}{displayExtra}</p>
        )}
        {editing ? renderEditControls() : renderFooterInfo()}
      </div>
    );
  }

  if (layout === "suporte") {
    return (
      <div className="rounded-lg bg-black/60 border border-white/10 p-5 mb-6 inline-block pr-16 shadow-lg relative group">
        {renderEditButton()}
        <span className="text-xs font-bold font-sans text-white/90 uppercase tracking-widest drop-shadow-md block mb-3 pr-8">{displayLabel}</span>
        {editing ? <div>{valorNode}</div> : (
          <p className="text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] flex items-baseline gap-4">
            {displayValor}
            {displayExtra && (
              <span className={`text-lg font-bold p-1 rounded border ${extraBadgeClass}`}>{displayExtra}</span>
            )}
          </p>
        )}
        {editing ? renderEditControls() : renderFooterInfo()}
      </div>
    );
  }

  return null;
};

// Editor inline para cada item de Avanços e Conquistas
const EditableAvanco = ({ chave, ordem, defaultProjeto, defaultProgresso, cor }: {
  chave: string;
  ordem: number;
  defaultProjeto: string;
  defaultProgresso: number;
  cor: string;
}) => {
  const { isAdmin } = useAuth();
  const { byChave, updateIndicador } = useIndicadores();
  const indicador = byChave(chave);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftLabel, setDraftLabel] = useState(defaultProjeto);
  const [draftValor, setDraftValor] = useState(defaultProgresso.toString());

  useEffect(() => {
    setDraftLabel(indicador?.label || defaultProjeto);
    setDraftValor(
      indicador?.valor !== null && indicador?.valor !== undefined
        ? indicador.valor.toString()
        : defaultProgresso.toString()
    );
  }, [indicador, defaultProjeto, defaultProgresso]);

  const projeto = indicador?.label || defaultProjeto;
  const progresso =
    indicador?.valor !== null && indicador?.valor !== undefined ? indicador.valor : defaultProgresso;

  const handleSave = async () => {
    setSaving(true);
    try {
      const num = Number(draftValor);
      if (Number.isNaN(num)) throw new Error("Valor inválido");
      const clamped = Math.max(0, Math.min(100, num));
      await updateIndicador(chave, clamped, null, draftLabel.trim() || defaultProjeto, "avancos", ordem);
      toast.success("Salvo com sucesso!");
      setEditing(false);
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraftLabel(projeto);
    setDraftValor(progresso.toString());
    setEditing(false);
  };

  return (
    <div className="relative z-10 w-full group/avanco">
      {isAdmin && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="absolute -top-1 right-0 p-1.5 rounded-md bg-white/5 opacity-40 group-hover/avanco:opacity-100 transition-opacity hover:bg-white/15 text-white/70 hover:text-white z-20"
          title="Editar"
        >
          <Edit2 size={14} />
        </button>
      )}
      {editing ? (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              autoFocus
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              className="flex-1 bg-black/50 border border-[#a7c64f]/60 rounded px-2 py-1 text-sm font-bold text-white focus:border-[#a7c64f] outline-none"
              placeholder="Projeto"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={draftValor}
              onChange={(e) => setDraftValor(e.target.value)}
              className="w-24 bg-black/50 border border-[#a7c64f]/60 rounded px-2 py-1 text-sm font-bold text-white focus:border-[#a7c64f] outline-none"
              placeholder="%"
            />
            <div className="flex gap-2">
              <button onClick={handleCancel} disabled={saving} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X size={14}/></button>
              <button onClick={handleSave} disabled={saving} className="p-1.5 rounded bg-[#a7c64f]/20 hover:bg-[#a7c64f]/40 text-[#a7c64f] transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14}/>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-baseline mb-2 pr-8">
            <span className="text-sm lg:text-base font-bold font-sans text-white tracking-wider drop-shadow-md">{projeto}</span>
            <span className="text-base font-bold font-sans text-white/90">{progresso}%</span>
          </div>
          <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden border border-white/20 shadow-inner">
            <div
              className={`h-full ${cor} relative shadow-[0_0_10px_currentColor]`}
              style={{ width: `${progresso}%`, transition: 'width 1s ease-in-out' }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/60 blur-[2px]" />
              <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const emptyImplantacao: Implantacao = { cliente: "", etapa: etapas[0], status: "em_dia", responsavel: "" };

const DashboardHome = () => {
  const { isAdmin } = useAuth();
  const [implantacoes, setImplantacoes] = useState<Implantacao[]>(() => {
    try {
      const raw = localStorage.getItem(IMPLANTACOES_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Implantacao[];
    } catch {}
    return implantacoesIniciais;
  });
  const [implDialogOpen, setImplDialogOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [implForm, setImplForm] = useState<Implantacao>(emptyImplantacao);
  const [implSupabaseAvailable, setImplSupabaseAvailable] = useState(false);

  const fetchImplantacoes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("implantacoes")
        .select("*")
        .order("ordem")
        .order("created_at");
      if (error) throw error;
      setImplSupabaseAvailable(true);
      if (data && data.length > 0) {
        setImplantacoes(
          data.map((r: any) => ({
            id: r.id,
            cliente: r.cliente,
            etapa: r.etapa,
            status: r.status as ImplantacaoStatus,
            responsavel: r.responsavel || "",
          })),
        );
      } else {
        setImplantacoes([]);
      }
    } catch (e) {
      console.warn("Falha ao carregar implantacoes do Supabase, usando localStorage:", e);
      setImplSupabaseAvailable(false);
    }
  }, []);

  useEffect(() => {
    fetchImplantacoes();
  }, [fetchImplantacoes]);

  useEffect(() => {
    if (implSupabaseAvailable) return; // se está no Supabase, não persiste localmente
    try {
      localStorage.setItem(IMPLANTACOES_STORAGE_KEY, JSON.stringify(implantacoes));
    } catch {}
  }, [implantacoes, implSupabaseAvailable]);

  const openNewImplantacao = () => {
    setEditingIdx(null);
    setImplForm(emptyImplantacao);
    setImplDialogOpen(true);
  };

  const openEditImplantacao = (idx: number) => {
    setEditingIdx(idx);
    setImplForm({ ...implantacoes[idx] });
    setImplDialogOpen(true);
  };

  const saveImplantacao = async () => {
    if (!implForm.cliente.trim()) {
      toast.error("Informe o cliente");
      return;
    }
    const payload = {
      cliente: implForm.cliente.trim(),
      etapa: implForm.etapa,
      status: implForm.status,
      responsavel: implForm.responsavel.trim(),
    };

    try {
      if (editingIdx !== null && implantacoes[editingIdx]?.id) {
        const { error } = await supabase
          .from("implantacoes")
          .update(payload)
          .eq("id", implantacoes[editingIdx].id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("implantacoes").insert([payload]);
        if (error) throw error;
      }
      await fetchImplantacoes();
      toast.success("Salvo com sucesso!");
    } catch (e) {
      console.warn("Falha ao salvar no Supabase, salvando localmente:", e);
      setImplantacoes((prev) => {
        if (editingIdx === null) return [...prev, { ...payload }];
        const next = [...prev];
        next[editingIdx] = { ...next[editingIdx], ...payload };
        return next;
      });
      toast.success("Salvo localmente");
    }
    setImplDialogOpen(false);
  };

  const removeImplantacao = async (idx: number) => {
    const item = implantacoes[idx];
    try {
      if (item?.id) {
        const { error } = await supabase.from("implantacoes").delete().eq("id", item.id);
        if (error) throw error;
        await fetchImplantacoes();
      } else {
        setImplantacoes((prev) => prev.filter((_, i) => i !== idx));
      }
      toast.success("Removido");
    } catch (e) {
      console.warn("Falha ao remover no Supabase:", e);
      toast.error("Erro ao remover");
    }
    setImplDialogOpen(false);
  };


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
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#a7c64f]/80 transition-all duration-300 hover:shadow-[0_0_25px_rgba(167,198,79,0.3)] flex flex-col">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#a7c64f]/20 blur-2xl rounded-full pointer-events-none" />
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-[#a7c64f] rounded-sm shadow-[0_0_12px_#a7c64f]" />
                  <h3 className="font-sans text-base font-bold tracking-normal text-[#a7c64f] drop-shadow-md">Painel Comercial</h3>
                </div>
                <ReportButton />
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* ERP */}
                <EditableIndicator 
                  chave="erp" 
                  defaultLabel="Novos Clientes ERP" 
                  defaultValue={12}
                  defaultValorExtra="+15%"
                  layout="commercial" 
                  groupHoverBorder="group-hover:border-[#a7c64f]/50" 
                />
                {/* Fábrica */}
                <EditableIndicator 
                  chave="fabrica" 
                  defaultLabel="Serviços Tech (em andamento)" 
                  defaultValue={8}
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
                <h3 className="font-sans text-base font-bold tracking-normal text-[#a7c64f] drop-shadow-md">Avanços e Conquistas</h3>
              </div>

              <div className="space-y-6 flex-1 flex flex-col justify-center">
                {avancosData.map((avanco, idx) => (
                  <EditableAvanco
                    key={idx}
                    chave={`avanco_${idx + 1}`}
                    ordem={idx + 1}
                    defaultProjeto={avanco.projeto}
                    defaultProgresso={avanco.progresso}
                    cor={avanco.cor}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Linha 2: Operacional ── */}
          <div className="flex items-center justify-between mt-10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-[#38b6ff] rounded-sm shadow-[0_0_12px_#38b6ff]" />
              <h3 className="font-sans text-base font-bold tracking-normal text-[#38b6ff] drop-shadow-md">Performance Operacional</h3>
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Desenvolvimento */}
            <div className="relative overflow-hidden rounded-xl border-2 border-white/20 p-6 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] group hover:border-[#38b6ff]/80 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Code2 size={18} className="text-[#38b6ff] drop-shadow-[0_0_8px_#38b6ff]" />
                  <h4 className="font-sans text-base font-bold tracking-normal text-[#38b6ff] drop-shadow-md">Desenvolvimento e QA</h4>
                </div>
                <ReportButton />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <EditableIndicator 
                  chave="entregas" 
                  defaultLabel="Entregas Realizadas" 
                  defaultValue={45}
                  layout="operacional" 
                />
                <EditableIndicator 
                  chave="retrabalho" 
                  defaultLabel="Retrabalho" 
                  defaultValue={4}
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
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Headphones size={18} className="text-[#38b6ff] drop-shadow-[0_0_8px_#38b6ff]" />
                  <h4 className="font-sans text-base font-bold tracking-normal text-[#38b6ff] drop-shadow-md">Suporte</h4>
                </div>
                <ReportButton />
              </div>
              <EditableIndicator 
                chave="chamados" 
                defaultLabel="Chamados Atendidos" 
                defaultValue={158}
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
                <h3 className="font-sans text-base font-bold tracking-normal text-white drop-shadow-md">Projetos em Implantação</h3>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={openNewImplantacao}
                    className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#a7c64f] bg-[#a7c64f]/10 border border-[#a7c64f]/30 hover:bg-[#a7c64f]/20 hover:border-[#a7c64f]/60 px-2.5 py-1.5 rounded-md transition-colors"
                    title="Adicionar implantação"
                  >
                    <Plus size={12} />
                    NOVA IMPLANTAÇÃO
                  </button>
                )}
                <ReportButton />
              </div>
            </div>
            
            <div className="space-y-5">
              {implantacoes.map((item, idx) => {
                const s = statusConfig[item.status];
                const StatusIcon = s.icon;
                const etapaIndex = etapas.indexOf(item.etapa);
                const progresso = etapaIndex >= 0 ? Math.round((etapaIndex / (etapas.length - 1)) * 100) : 0;
                return (
                  <div
                    key={`${item.cliente}-${idx}`}
                    className="relative rounded-lg border-2 border-white/10 bg-black/60 p-5 transition-all duration-300 hover:border-white/30 overflow-hidden shadow-md group/impl"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" }} />
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                        <button
                          onClick={() => openEditImplantacao(idx)}
                          className="p-1.5 rounded-md bg-white/5 opacity-40 group-hover/impl:opacity-100 transition-opacity hover:bg-white/15 text-white/70 hover:text-white"
                          title="Editar implantação"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir implantação de "${item.cliente}"?`)) {
                              removeImplantacao(idx);
                            }
                          }}
                          className="p-1.5 rounded-md bg-white/5 opacity-40 group-hover/impl:opacity-100 transition-opacity hover:bg-red-500/20 text-white/70 hover:text-red-300"
                          title="Excluir implantação"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    <div className={`flex flex-col md:flex-row md:items-center gap-4 mb-6 pl-3 ${isAdmin ? "pr-24" : "pr-8"}`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <StatusIcon size={20} className={s.color} />
                        <span className="font-sans text-lg font-bold tracking-wide text-white truncate drop-shadow-sm">{item.cliente}</span>
                        <span className={`text-xs uppercase font-bold font-sans px-3 py-1 rounded border-2 ${s.border} ${s.color}`}>
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm font-bold font-sans text-white/90">
                        <span className="uppercase tracking-widest bg-white/10 px-3 py-1 rounded-sm border border-white/10">RESP: {item.responsavel}</span>
                        <span className="text-xl text-white">{progresso}%</span>
                      </div>
                    </div>
                    {/* Linha do tempo (progress bar com steps) */}
                    <div className="relative flex items-center px-4">
                      {/* Linha base contínua */}
                      <div className="absolute left-4 right-4 top-2 h-1 bg-white/10 rounded-full z-0" />
                      {/* Linha de progresso preenchida */}
                      <div
                        className="absolute left-4 top-2 h-1 rounded-full z-0 transition-all duration-500"
                        style={{
                          width: etapaIndex >= 0 ? `calc((100% - 2rem) * ${etapaIndex / (etapas.length - 1)})` : '0%',
                          backgroundColor: s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor",
                          opacity: 0.85,
                        }}
                      />
                      {etapas.map((etapa, eIdx) => {
                        const isCompleted = eIdx <= etapaIndex;
                        const isCurrent = eIdx === etapaIndex;
                        const mainColor = isCompleted ? s.color.match(/text-\[(.*?)\]/)?.[1] || "currentColor" : "rgba(255,255,255,0.15)";

                        return (
                          <div key={etapa} className="flex-1 relative flex flex-col items-center">
                            <div className="relative flex items-center justify-center w-full mb-3">
                               <div
                                className={`w-4 h-4 rounded-sm z-10 transition-all ${isCurrent ? 'scale-110' : ''}`}
                                style={{ backgroundColor: mainColor, transform: 'rotate(45deg)' }}
                               />
                            </div>
                            <span className={`text-xs whitespace-nowrap font-bold font-sans ${isCurrent ? 'text-white' : 'text-white/60'}`}>
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

          {/* Dialog de edição de implantação */}
          <Dialog open={implDialogOpen} onOpenChange={(o) => { setImplDialogOpen(o); if (!o) setEditingIdx(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingIdx === null ? "Nova implantação" : "Editar implantação"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input value={implForm.cliente} onChange={(e) => setImplForm({ ...implForm, cliente: e.target.value })} placeholder="Nome do cliente" />
                </div>
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Input value={implForm.responsavel} onChange={(e) => setImplForm({ ...implForm, responsavel: e.target.value })} placeholder="Nome do responsável" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Etapa atual</Label>
                    <Select value={implForm.etapa} onValueChange={(v) => setImplForm({ ...implForm, etapa: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {etapas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={implForm.status} onValueChange={(v) => setImplForm({ ...implForm, status: v as ImplantacaoStatus })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="em_dia">Em dia</SelectItem>
                        <SelectItem value="atencao">Atenção</SelectItem>
                        <SelectItem value="atrasado">Atrasado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex sm:justify-between gap-2">
                <div>
                  {editingIdx !== null && (
                    <Button variant="destructive" onClick={() => removeImplantacao(editingIdx)}>
                      <Trash2 size={14} className="mr-1" /> Excluir
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setImplDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={saveImplantacao}>Salvar</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>


        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardHome;

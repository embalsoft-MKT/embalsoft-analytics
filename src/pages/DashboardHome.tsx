import { CheckCircle2, Clock, AlertTriangle, Code2, Headphones, Download, Edit2, Loader2, Save, X, User as UserIcon, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
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

import { useAuth } from "@/contexts/AuthContext";
import { useIndicadores, fetchHistorico } from "@/hooks/useIndicadores";
import { useState, useEffect } from "react";
import { toast } from "sonner";

/* ─────────── Design tokens (SaaS premium) ─────────── */
const BRAND = {
  blue: "#2563EB",
  green: "#84CC16",
  orange: "#F97316",
};

const cardBase =
  "rounded-2xl bg-[#111827] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.25)] p-6";
const sectionTitle = "text-[18px] font-semibold text-white tracking-tight";
const labelText = "text-[14px] font-medium text-white/60";
const kpiText = "text-[52px] leading-none font-bold text-white tracking-tight";

/* ─────────── Report button (disabled) ─────────── */
const ReportButton = () => (
  <button
    disabled
    title="Em breve"
    className="flex items-center gap-1.5 text-[12px] font-medium text-white/50 bg-white/[0.04] border border-white/[0.06] hover:border-white/10 px-2.5 py-1.5 rounded-lg opacity-70 cursor-not-allowed transition-colors"
  >
    <Download size={12} />
    Relatório
  </button>
);

/* ─────────── Mock data (preservada) ─────────── */
const avancosData = [
  { projeto: "Embalsoft CRM 2.0", progresso: 80, cor: BRAND.green },
  { projeto: "BI Nativo do ERP", progresso: 15, cor: BRAND.blue },
  { projeto: "Agentes de IA", progresso: 5, cor: BRAND.blue },
];

const implantacoes = [
  { cliente: "Ind. Nova Era", etapa: "Go Live", progresso: 100, status: "em_dia" as const, responsavel: "Marcos" },
  { cliente: "Distribuidora Sol", etapa: "Testes", progresso: 70, status: "atencao" as const, responsavel: "Renan" },
  { cliente: "Metalúrgica Forte", etapa: "Imersão Geral", progresso: 35, status: "em_dia" as const, responsavel: "Marcos" },
  { cliente: "Alimentos Vida", etapa: "Kick-off", progresso: 10, status: "atrasado" as const, responsavel: "Renan" },
];

const etapas = ["Kick-off", "Levantamento", "Imersão Geral", "Configuração", "Treinamento", "Testes", "Simulado", "Go Live"];

const statusConfig = {
  em_dia: { hex: BRAND.green, label: "Em dia", icon: CheckCircle2 },
  atencao: { hex: BRAND.orange, label: "Atenção", icon: Clock },
  atrasado: { hex: "#EF4444", label: "Atrasado", icon: AlertTriangle },
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
  entregas: { label: "Entregas", color: BRAND.blue },
  retrabalho: { label: "Retrabalho", color: BRAND.orange },
};

const supportChartConfig: ChartConfig = {
  atendimentos: { label: "Atendimentos", color: BRAND.blue },
};

/* ─────────── Growth badge ─────────── */
const GrowthBadge = ({ value }: { value: string }) => {
  if (!value) return null;
  const isNeg = value.startsWith("-");
  const isPos = value.startsWith("+");
  if (!isNeg && !isPos) {
    return (
      <span className="inline-flex items-center text-[12px] font-semibold text-white/60 bg-white/[0.05] rounded-lg px-2 py-1">
        {value}
      </span>
    );
  }
  const color = isNeg ? BRAND.orange : BRAND.green;
  const Icon = isNeg ? TrendingDown : TrendingUp;
  return (
    <span
      className="inline-flex items-center gap-1 text-[12px] font-semibold rounded-lg px-2 py-1"
      style={{ color, backgroundColor: `${color}26` }}
    >
      <Icon size={12} />
      {value}
    </span>
  );
};

/* ─────────── EditableIndicator ─────────── */
const EditableIndicator = ({
  chave,
  defaultLabel,
  defaultValue,
  defaultValorExtra,
  layout,
  accent,
  suffix,
}: {
  chave: string;
  defaultLabel: string;
  defaultValue: number;
  defaultValorExtra?: string;
  layout: "commercial" | "operacional" | "retrabalho" | "suporte";
  accent?: string;
  suffix?: string;
}) => {
  const { isAdmin } = useAuth();
  const { byChave, updateIndicador } = useIndicadores();
  const indicador = byChave(chave);

  const [editing, setEditing] = useState(false);
  const [draftValor, setDraftValor] = useState("");
  const [saving, setSaving] = useState(false);
  const [prevValor, setPrevValor] = useState<number | null>(null);

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

  const handleCancel = () => {
    setEditing(false);
    if (indicador) {
      setDraftValor(indicador.valor !== null && indicador.valor !== undefined ? indicador.valor.toString() : defaultValue.toString());
    } else {
      setDraftValor(defaultValue.toString());
    }
  };

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

  const displayLabel = indicador?.label || defaultLabel;
  const displayValor = indicador?.valor !== null && indicador?.valor !== undefined ? indicador.valor : defaultValue;
  const displayExtra = computedExtra;

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

      await updateIndicador(chave, num, displayExtra || null, displayLabel, categoria, ordem);
      toast.success("Salvo com sucesso!");
      setEditing(false);
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar indicador");
    } finally {
      setSaving(false);
    }
  };

  const editBtn = isAdmin && !editing && (
    <button
      onClick={() => setEditing(true)}
      className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 text-white/50 hover:text-white"
      title="Editar valor"
    >
      <Edit2 size={13} />
    </button>
  );

  const editControls = (
    <div className="flex justify-between items-center mt-3 border-t border-white/10 pt-3">
      <div className="text-[11px] text-white/40">
        {indicador?.updated_at && <>Atualizado {new Date(indicador.updated_at).toLocaleDateString("pt-BR")}</>}
      </div>
      <div className="flex gap-2">
        <button onClick={handleCancel} disabled={saving} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"><X size={13} /></button>
        <button onClick={handleSave} disabled={saving} className="p-1.5 rounded-md text-white" style={{ backgroundColor: BRAND.blue }}>
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
        </button>
      </div>
    </div>
  );

  const footerInfo = isAdmin && indicador?.updated_at && !editing && (
    <div className="mt-3 text-[11px] text-white/35 flex items-center gap-1">
      <UserIcon size={10} /> {indicador.updated_by_name || "Admin"}
    </div>
  );

  const editorInput = (
    <input
      type="number"
      step="0.1"
      autoFocus
      value={draftValor}
      onChange={(e) => setDraftValor(e.target.value)}
      className="w-40 bg-black/40 border border-white/20 focus:border-[#2563EB] rounded-lg px-3 py-2 text-3xl font-bold text-white outline-none"
      placeholder="Valor"
    />
  );

  const valueColor =
    layout === "retrabalho" ? BRAND.orange : accent || "#FFFFFF";

  return (
    <div className={`${cardBase} relative group flex flex-col justify-between transition-colors hover:border-white/15`}>
      {editBtn}
      <div>
        <span className={`${labelText} block pr-8`}>{displayLabel}</span>
        <div className="flex items-end gap-3 mt-4">
          {editing ? (
            editorInput
          ) : (
            <span className={kpiText} style={{ color: valueColor }}>
              {displayValor}
              {layout === "retrabalho" && <span className="text-[32px] font-semibold ml-1">%</span>}
              {suffix && <span className="text-[24px] font-semibold text-white/60 ml-1">{suffix}</span>}
            </span>
          )}
          {!editing && layout !== "retrabalho" && <GrowthBadge value={displayExtra} />}
        </div>
      </div>
      {editing ? editControls : footerInfo}
    </div>
  );
};

/* ─────────── Section header ─────────── */
const SectionHeader = ({
  title,
  accent,
  action,
}: {
  title: string;
  accent: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <span
        className="w-1.5 h-5 rounded-full"
        style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}66` }}
      />
      <h3 className={sectionTitle}>{title}</h3>
    </div>
    {action}
  </div>
);

/* ─────────── Page ─────────── */
const DashboardHome = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-10 pb-10 animate-fade-in-up">
        {/* Title */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold text-white tracking-tight">Visão geral</h1>
            <p className="text-[14px] font-medium text-white/50 mt-1">
              Acompanhe os indicadores e o progresso das áreas em tempo real.
            </p>
          </div>
        </div>

        {/* ── Painel Comercial ── */}
        <section>
          <SectionHeader title="Painel Comercial" accent={BRAND.orange} action={<ReportButton />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <EditableIndicator
              chave="erp"
              defaultLabel="Novos clientes ERP"
              defaultValue={12}
              defaultValorExtra="+15%"
              layout="commercial"
              accent="#FFFFFF"
            />
            <EditableIndicator
              chave="fabrica"
              defaultLabel="Serviços Tech (em andamento)"
              defaultValue={8}
              defaultValorExtra="+10%"
              layout="commercial"
              accent="#FFFFFF"
            />
          </div>
        </section>

        {/* ── Avanços ── */}
        <section>
          <SectionHeader title="Avanços e Conquistas" accent={BRAND.green} />
          <div className={`${cardBase}`}>
            <div className="space-y-6">
              {avancosData.map((avanco, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[14px] font-medium text-white">{avanco.projeto}</span>
                    <span className="text-[14px] font-semibold text-white/80">{avanco.progresso}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${avanco.progresso}%`, backgroundColor: avanco.cor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Performance Operacional ── */}
        <section>
          <SectionHeader title="Performance Operacional" accent={BRAND.blue} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Desenvolvimento */}
            <div className={cardBase}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md" style={{ backgroundColor: `${BRAND.blue}1f` }}>
                    <Code2 size={16} style={{ color: BRAND.blue }} />
                  </div>
                  <h4 className="text-[16px] font-semibold text-white">Desenvolvimento e QA</h4>
                </div>
                <ReportButton />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <EditableIndicator
                  chave="entregas"
                  defaultLabel="Entregas realizadas"
                  defaultValue={45}
                  layout="operacional"
                  accent="#FFFFFF"
                />
                <EditableIndicator
                  chave="retrabalho"
                  defaultLabel="Retrabalho"
                  defaultValue={4}
                  defaultValorExtra="%"
                  layout="retrabalho"
                />
              </div>
              <ChartContainer config={devChartConfig} className="h-[220px] w-full">
                <BarChart data={devData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="entregas" fill={BRAND.blue} radius={[6, 6, 0, 0]} barSize={18} />
                  <Bar dataKey="retrabalho" fill={BRAND.orange} radius={[6, 6, 0, 0]} barSize={18} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Suporte */}
            <div className={cardBase}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md" style={{ backgroundColor: `${BRAND.blue}1f` }}>
                    <Headphones size={16} style={{ color: BRAND.blue }} />
                  </div>
                  <h4 className="text-[16px] font-semibold text-white">Suporte</h4>
                </div>
                <ReportButton />
              </div>
              <div className="mb-6">
                <EditableIndicator
                  chave="chamados"
                  defaultLabel="Chamados atendidos"
                  defaultValue={158}
                  defaultValorExtra="+8%"
                  layout="suporte"
                  accent="#FFFFFF"
                />
              </div>
              <ChartContainer config={supportChartConfig} className="h-[220px] w-full">
                <LineChart data={supportData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="atendimentos"
                    stroke={BRAND.blue}
                    strokeWidth={3}
                    dot={{ fill: BRAND.blue, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#fff", stroke: BRAND.blue, strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </section>

        {/* ── Implantações ── */}
        <section>
          <SectionHeader title="Projetos em Implantação" accent="#FFFFFF" action={<ReportButton />} />
          <div className={cardBase}>
            <div className="space-y-4">
              {implantacoes.map((item) => {
                const s = statusConfig[item.status];
                const StatusIcon = s.icon;
                const etapaIndex = etapas.indexOf(item.etapa);
                return (
                  <div
                    key={item.cliente}
                    className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/15"
                  >
                    <div
                      className="absolute left-0 top-3 bottom-3 w-1 rounded-r"
                      style={{ backgroundColor: s.hex }}
                    />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pl-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <StatusIcon size={18} style={{ color: s.hex }} />
                        <span className="text-[15px] font-semibold text-white truncate">{item.cliente}</span>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          style={{ color: s.hex, backgroundColor: `${s.hex}22` }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-5 text-[13px] font-medium text-white/70">
                        <span>Resp: <span className="text-white">{item.responsavel}</span></span>
                        <span className="text-[18px] font-semibold text-white">{item.progresso}%</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative flex items-center px-3">
                      <div className="absolute left-3 right-3 top-1.5 h-[2px] bg-white/[0.06] rounded-full z-0" />
                      <div
                        className="absolute left-3 top-1.5 h-[2px] rounded-full z-0 transition-all duration-500"
                        style={{
                          width: etapaIndex >= 0 ? `calc((100% - 1.5rem) * ${etapaIndex / (etapas.length - 1)})` : "0%",
                          backgroundColor: s.hex,
                        }}
                      />
                      {etapas.map((etapa, idx) => {
                        const isCompleted = idx <= etapaIndex;
                        const isCurrent = idx === etapaIndex;
                        const color = isCompleted ? s.hex : "rgba(255,255,255,0.15)";
                        return (
                          <div key={etapa} className="flex-1 relative flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full z-10 transition-all ${isCurrent ? "ring-4 scale-110" : ""}`}
                              style={{
                                backgroundColor: color,
                                boxShadow: isCurrent ? `0 0 0 4px ${s.hex}33` : undefined,
                              }}
                            />
                            <span className={`mt-2.5 text-[11px] font-medium whitespace-nowrap ${isCurrent ? "text-white" : "text-white/45"}`}>
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
        </section>
      </div>
    </TooltipProvider>
  );
};

export default DashboardHome;

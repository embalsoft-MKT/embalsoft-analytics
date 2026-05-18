import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIndicadores, fetchHistorico, type Indicador, type IndicadorHistorico } from "@/hooks/useIndicadores";
import { useAuth } from "@/contexts/AuthContext";
import { History, Loader2, X, Lock, Check, User as UserIcon, Save } from "lucide-react";
import { toast } from "sonner";

const categoriaLabel: Record<string, { label: string; color: string }> = {
  comercial: { label: "PAINEL COMERCIAL", color: "#f48121" },
  avancos: { label: "AVANÇOS E CONQUISTAS", color: "#a7c64f" },
  operacional: { label: "PERFORMANCE OPERACIONAL", color: "#38b6ff" },
};

// Inline auto-save cell
const InlineCell: React.FC<{
  value: string;
  type?: "number" | "text";
  placeholder?: string;
  disabled?: boolean;
  onSave: (val: string) => Promise<void>;
}> = ({ value, type = "text", placeholder, disabled, onSave }) => {
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const initial = useRef(value);

  useEffect(() => {
    setDraft(value);
    initial.current = value;
  }, [value]);

  const commit = async () => {
    if (draft === initial.current) return;
    setSaving(true);
    try {
      await onSave(draft);
      initial.current = draft;
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1200);
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar");
      setDraft(initial.current);
    } finally {
      setSaving(false);
    }
  };

  if (disabled) {
    return <span className="text-white/90">{value || "—"}</span>;
  }

  return (
    <div className="relative inline-flex items-center gap-1 group">
      <input
        type={type}
        step={type === "number" ? "0.1" : undefined}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") {
            setDraft(initial.current);
            (e.target as HTMLInputElement).blur();
          }
        }}
        className={`bg-black/60 border border-white/20 hover:border-[#38b6ff]/60 focus:border-[#38b6ff] focus:outline-none rounded px-2 py-1 text-white transition-colors ${type === 'number' ? 'w-24' : 'w-40'}`}
      />
      <button 
        onMouseDown={(e) => { e.preventDefault(); commit(); }}
        className={`p-1 rounded text-white/50 hover:text-[#38b6ff] hover:bg-white/10 transition-all ${draft === initial.current ? 'opacity-0 pointer-events-none' : 'opacity-100'} group-hover:opacity-100`}
        title="Salvar"
      >
        <Save size={14} />
      </button>
      {saving && <Loader2 size={14} className="animate-spin text-[#38b6ff] absolute -right-6" />}
      {!saving && savedFlash && <Check size={14} className="text-[#a7c64f] absolute -right-6" />}
    </div>
  );
};

const Indicadores = () => {
  const { indicadores, loading, updateIndicador } = useIndicadores();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [historicoFor, setHistoricoFor] = useState<Indicador | null>(null);
  const [historico, setHistorico] = useState<IndicadorHistorico[]>([]);
  const [historicoLoading, setHistoricoLoading] = useState(false);

  useEffect(() => {
    if (isAdmin === false) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const openHistorico = async (i: Indicador) => {
    setHistoricoFor(i);
    setHistorico([]);
    setHistoricoLoading(true);
    try {
      const data = await fetchHistorico(i.id);
      setHistorico(data);
    } catch (e: any) {
      toast.error(e.message || "Erro ao carregar histórico");
    } finally {
      setHistoricoLoading(false);
    }
  };

  const saveLabel = async (i: Indicador, raw: string) => {
    if (!raw.trim()) throw new Error("O nome do indicador não pode ser vazio");
    await updateIndicador(i.id, i.valor, i.valor_extra, raw);
  };

  const saveValor = async (i: Indicador, raw: string) => {
    const num = raw === "" ? null : Number(raw);
    if (num !== null && Number.isNaN(num)) throw new Error("Valor inválido");
    await updateIndicador(i.id, num, i.valor_extra, i.label);
  };

  const saveExtra = async (i: Indicador, raw: string) => {
    await updateIndicador(i.id, i.valor, raw || null, i.label);
  };

  const grouped = indicadores.reduce<Record<string, Indicador[]>>((acc, i) => {
    (acc[i.categoria] = acc[i.categoria] || []).push(i);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in-up pb-8">
      <div className="mt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-8 bg-white rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white drop-shadow-lg">
            GESTÃO DE INDICADORES
          </h1>
        </div>
        <p className="text-muted-foreground font-sans text-sm md:text-base max-w-2xl">
          {isAdmin
            ? "Edite os valores diretamente nas células. As alterações são salvas automaticamente e o histórico é registrado."
            : "Visualização dos indicadores. Apenas administradores podem editar valores."}
        </p>
        {!isAdmin && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#f48121] border border-[#f48121]/40 bg-[#f48121]/10 px-3 py-1.5 rounded">
            <Lock size={12} /> Modo somente leitura
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-white/70">
          <Loader2 className="animate-spin" size={18} /> Carregando…
        </div>
      )}

      {Object.entries(grouped).map(([categoria, items]) => {
        const meta = categoriaLabel[categoria] ?? { label: categoria.toUpperCase(), color: "#fff" };
        return (
          <section key={categoria} className="rounded-xl border-2 border-white/20 bg-card/80 backdrop-blur-md p-6 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-6 rounded-sm" style={{ backgroundColor: meta.color, boxShadow: `0 0 12px ${meta.color}` }} />
              <h2 className="font-sans text-sm font-bold tracking-[0.2em] uppercase" style={{ color: meta.color }}>{meta.label}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/60 uppercase text-xs tracking-widest border-b border-white/10">
                    <th className="py-2 pr-4">Indicador</th>
                    <th className="py-2 pr-4">Valor</th>
                    <th className="py-2 pr-4">Extra</th>
                    <th className="py-2 pr-4">Última atualização</th>
                    <th className="py-2 pr-4">Alterado por</th>
                    <th className="py-2 pr-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 pr-4 font-bold text-white">
                        <InlineCell
                          value={i.label}
                          type="text"
                          placeholder="Nome do Indicador"
                          disabled={!isAdmin}
                          onSave={(v) => saveLabel(i, v)}
                        />
                      </td>
                      <td className="py-3 pr-6">
                        <InlineCell
                          value={i.valor?.toString() ?? ""}
                          type="number"
                          placeholder="—"
                          disabled={!isAdmin}
                          onSave={(v) => saveValor(i, v)}
                        />
                      </td>
                      <td className="py-3 pr-6">
                        <InlineCell
                          value={i.valor_extra ?? ""}
                          type="text"
                          placeholder="ex: +15%"
                          disabled={!isAdmin}
                          onSave={(v) => saveExtra(i, v)}
                        />
                      </td>
                      <td className="py-3 pr-4 text-white/70 text-xs">
                        {new Date(i.updated_at).toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3 pr-4 text-white/70 text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <UserIcon size={12} className="text-white/40" />
                          {i.updated_by_name || (i.updated_by ? "—" : "Sistema")}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openHistorico(i)}
                            className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded text-xs"
                          >
                            <History size={14} /> Histórico
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {historicoFor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setHistoricoFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card border-2 border-white/20 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Histórico — {historicoFor.label}</h3>
              <button onClick={() => setHistoricoFor(null)} className="text-white/60 hover:text-white"><X size={20} /></button>
            </div>
            {historicoLoading ? (
              <div className="flex items-center gap-2 text-white/70"><Loader2 className="animate-spin" size={16} /> Carregando histórico…</div>
            ) : historico.length === 0 ? (
              <p className="text-white/60 text-sm">Sem alterações registradas ainda.</p>
            ) : (
              <div className="space-y-2">
                {historico.map((h) => (
                  <div key={h.id} className="border border-white/10 bg-black/40 rounded p-3 text-sm">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/60">{new Date(h.alterado_em).toLocaleString("pt-BR")}</span>
                      <span className="inline-flex items-center gap-1 text-white/50">
                        <UserIcon size={12} /> {h.alterado_por_name || "—"}
                      </span>
                    </div>
                    <div className="text-white">
                      <span className="text-red-400 line-through">{h.valor_anterior ?? "—"} {h.valor_extra_anterior ?? ""}</span>
                      {" → "}
                      <span className="text-[#a7c64f] font-bold">{h.valor_novo ?? "—"} {h.valor_extra_novo ?? ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Indicadores;

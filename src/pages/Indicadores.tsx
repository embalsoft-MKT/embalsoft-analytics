import { useEffect, useState } from "react";
import { useIndicadores, fetchHistorico, type Indicador, type IndicadorHistorico } from "@/hooks/useIndicadores";
import { Pencil, History, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const categoriaLabel: Record<string, { label: string; color: string }> = {
  comercial: { label: "PAINEL COMERCIAL", color: "#f48121" },
  avancos: { label: "AVANÇOS E CONQUISTAS", color: "#a7c64f" },
  operacional: { label: "PERFORMANCE OPERACIONAL", color: "#38b6ff" },
};

const Indicadores = () => {
  const { indicadores, loading, updateIndicador } = useIndicadores();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [valor, setValor] = useState<string>("");
  const [valorExtra, setValorExtra] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [historicoFor, setHistoricoFor] = useState<Indicador | null>(null);
  const [historico, setHistorico] = useState<IndicadorHistorico[]>([]);

  const startEdit = (i: Indicador) => {
    setEditingId(i.id);
    setValor(i.valor?.toString() ?? "");
    setValorExtra(i.valor_extra ?? "");
  };

  const cancel = () => {
    setEditingId(null);
    setValor("");
    setValorExtra("");
  };

  const save = async (i: Indicador) => {
    setSaving(true);
    try {
      const num = valor === "" ? null : Number(valor);
      if (num !== null && Number.isNaN(num)) {
        toast.error("Valor inválido");
        return;
      }
      await updateIndicador(i.id, num, valorExtra || null);
      toast.success("Indicador atualizado");
      cancel();
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const openHistorico = async (i: Indicador) => {
    setHistoricoFor(i);
    setHistorico([]);
    try {
      const data = await fetchHistorico(i.id);
      setHistorico(data);
    } catch (e: any) {
      toast.error(e.message || "Erro ao carregar histórico");
    }
  };

  const grouped = indicadores.reduce<Record<string, Indicador[]>>((acc, i) => {
    (acc[i.categoria] = acc[i.categoria] || []).push(i);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in-up pb-8">
      <div className="flex items-center gap-3">
        <div className="w-2 h-6 bg-white rounded-sm shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
        <h1 className="font-mono text-lg font-bold tracking-[0.2em] text-white uppercase">Gestão de Indicadores</h1>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-white/70"><Loader2 className="animate-spin" size={18} /> Carregando…</div>
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
                    <th className="py-2 pr-4">Atualizado em</th>
                    <th className="py-2 pr-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => {
                    const editing = editingId === i.id;
                    return (
                      <tr key={i.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 pr-4 font-bold text-white">{i.label}</td>
                        <td className="py-3 pr-4">
                          {editing ? (
                            <input
                              autoFocus
                              type="number"
                              step="0.1"
                              value={valor}
                              onChange={(e) => setValor(e.target.value)}
                              className="bg-black/60 border border-white/20 rounded px-2 py-1 w-28 text-white"
                            />
                          ) : (
                            <span className="text-white/90">{i.valor ?? "—"}</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          {editing ? (
                            <input
                              type="text"
                              value={valorExtra}
                              onChange={(e) => setValorExtra(e.target.value)}
                              placeholder="ex: +15%"
                              className="bg-black/60 border border-white/20 rounded px-2 py-1 w-28 text-white"
                            />
                          ) : (
                            <span className="text-white/70">{i.valor_extra ?? "—"}</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-white/60 text-xs">
                          {new Date(i.updated_at).toLocaleString("pt-BR")}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center justify-end gap-2">
                            {editing ? (
                              <>
                                <button
                                  onClick={() => save(i)}
                                  disabled={saving}
                                  className="flex items-center gap-1 bg-[#a7c64f] hover:bg-[#a7c64f]/90 text-black font-bold px-3 py-1.5 rounded text-xs"
                                >
                                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Salvar
                                </button>
                                <button onClick={cancel} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs">
                                  <X size={14} /> Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(i)}
                                  className="flex items-center gap-1 bg-[#38b6ff]/20 hover:bg-[#38b6ff]/30 text-[#38b6ff] border border-[#38b6ff]/40 px-3 py-1.5 rounded text-xs font-bold"
                                >
                                  <Pencil size={14} /> Editar
                                </button>
                                <button
                                  onClick={() => openHistorico(i)}
                                  className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded text-xs"
                                >
                                  <History size={14} /> Histórico
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
            {historico.length === 0 ? (
              <p className="text-white/60 text-sm">Sem histórico ainda.</p>
            ) : (
              <div className="space-y-2">
                {historico.map((h) => (
                  <div key={h.id} className="border border-white/10 bg-black/40 rounded p-3 text-sm">
                    <div className="text-white/60 text-xs mb-1">{new Date(h.alterado_em).toLocaleString("pt-BR")}</div>
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

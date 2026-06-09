import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface Indicador {
  id: string;
  chave: string;
  label: string;
  categoria: "comercial" | "avancos" | "operacional";
  valor: number | null;
  valor_extra: string | null;
  ordem: number;
  updated_at: string;
  updated_by: string | null;
  updated_by_name?: string | null;
}

export interface IndicadorHistorico {
  id: string;
  indicador_id: string;
  chave: string;
  valor_anterior: number | null;
  valor_extra_anterior: string | null;
  valor_novo: number | null;
  valor_extra_novo: string | null;
  alterado_em: string;
  alterado_por: string | null;
  alterado_por_name?: string | null;
}

const enrichWithNames = async <T extends { updated_by?: string | null; alterado_por?: string | null }>(
  rows: T[],
  field: "updated_by" | "alterado_por",
  nameField: string
): Promise<any[]> => {
  const ids = Array.from(new Set(rows.map((r: any) => r[field]).filter(Boolean))) as string[];
  if (ids.length === 0) return rows;
  const { data } = await supabase.from("profiles").select("id, full_name").in("id", ids);
  const map = new Map((data || []).map((p: any) => [p.id, p.full_name]));
  return rows.map((r: any) => ({ ...r, [nameField]: r[field] ? map.get(r[field]) ?? null : null }));
};

export const useIndicadores = () => {
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("indicadores")
      .select("*")
      .order("categoria")
      .order("ordem");
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const enriched = await enrichWithNames(data || [], "updated_by", "updated_by_name");
    setIndicadores(enriched as Indicador[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateIndicador = useCallback(
    async (
      chave: string,
      valor: number | null,
      valor_extra: string | null,
      label: string,
      categoria: "comercial" | "avancos" | "operacional",
      ordem: number
    ) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("indicadores")
        .upsert(
          {
            chave,
            label,
            categoria,
            valor,
            valor_extra,
            updated_by: user?.id ?? null,
            ordem
          },
          { onConflict: "chave" }
        );
      if (error) throw error;
      await fetchAll();
    },
    [fetchAll]
  );

  const byChave = (chave: string) => indicadores.find((i) => i.chave === chave);

  return { indicadores, loading, error, refetch: fetchAll, updateIndicador, byChave };
};

export const fetchHistorico = async (indicadorId: string) => {
  // Sem limite: necessário para cálculo anual com granularidade mensal.
  // Históricos mensais = até 12 registros/ano por indicador — volume controlado.
  const { data, error } = await supabase
    .from("indicadores_historico")
    .select("*")
    .eq("indicador_id", indicadorId)
    .order("alterado_em", { ascending: false });
  if (error) throw error;
  const enriched = await enrichWithNames(data || [], "alterado_por", "alterado_por_name");
  return enriched as IndicadorHistorico[];
};

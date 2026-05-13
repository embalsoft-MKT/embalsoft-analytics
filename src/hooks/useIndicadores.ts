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
}

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
    if (error) setError(error.message);
    else setIndicadores((data || []) as Indicador[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateIndicador = useCallback(
    async (id: string, valor: number | null, valor_extra: string | null) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("indicadores")
        .update({ valor, valor_extra, updated_by: user?.id ?? null })
        .eq("id", id);
      if (error) throw error;
      await fetchAll();
    },
    [fetchAll]
  );

  const byChave = (chave: string) => indicadores.find((i) => i.chave === chave);

  return { indicadores, loading, error, refetch: fetchAll, updateIndicador, byChave };
};

export const fetchHistorico = async (indicadorId: string) => {
  const { data, error } = await supabase
    .from("indicadores_historico")
    .select("*")
    .eq("indicador_id", indicadorId)
    .order("alterado_em", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data || []) as IndicadorHistorico[];
};

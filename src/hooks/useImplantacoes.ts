import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type ImplantacaoStatus = "em_dia" | "atencao" | "atrasado";

export interface Implantacao {
  id?: string;
  cliente: string;
  etapa: string;
  status: ImplantacaoStatus;
  responsavel: string;
  ordem?: number;
}

const seedData: Implantacao[] = [
  { cliente: "Ind. Nova Era", etapa: "Go Live", status: "em_dia", responsavel: "Marcos", ordem: 0 },
  { cliente: "Distribuidora Sol", etapa: "Testes", status: "atencao", responsavel: "Renan", ordem: 1 },
  { cliente: "Metalúrgica Forte", etapa: "Imersão Geral", status: "em_dia", responsavel: "Marcos", ordem: 2 },
  { cliente: "Alimentos Vida", etapa: "Kick-off", status: "atrasado", responsavel: "Renan", ordem: 3 },
];

export const useImplantacoes = () => {
  const [implantacoes, setImplantacoes] = useState<Implantacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("implantacoes")
        .select("*")
        .order("ordem");
      if (error) throw error;
      if (!data || data.length === 0) {
        // Seed na primeira vez
        const { data: inserted } = await supabase
          .from("implantacoes")
          .insert(seedData)
          .select();
        setImplantacoes((inserted as Implantacao[]) || []);
      } else {
        setImplantacoes(data as Implantacao[]);
      }
    } catch (e) {
      console.error("Erro ao carregar implantações:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const onFocus = () => fetchAll();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchAll]);

  const addImplantacao = async (item: Implantacao) => {
    const maxOrdem = implantacoes.reduce((m, i) => Math.max(m, i.ordem ?? 0), -1);
    const { error } = await supabase.from("implantacoes").insert({ ...item, ordem: maxOrdem + 1 });
    if (error) throw error;
    await fetchAll();
  };

  const updateImplantacao = async (id: string, item: Partial<Implantacao>) => {
    const { error } = await supabase.from("implantacoes").update(item).eq("id", id);
    if (error) throw error;
    await fetchAll();
  };

  const deleteImplantacao = async (id: string) => {
    const { error } = await supabase.from("implantacoes").delete().eq("id", id);
    if (error) throw error;
    await fetchAll();
  };

  return { implantacoes, loading, addImplantacao, updateImplantacao, deleteImplantacao, refetch: fetchAll };
};

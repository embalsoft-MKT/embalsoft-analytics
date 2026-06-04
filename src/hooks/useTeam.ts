import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface TeamMember {
  id?: string;
  section: string;
  name: string;
  role: string;
  is_leader?: boolean;
  is_pj?: boolean;
  parceria_desde?: string | null;
  sede?: string | null;
  admissao?: string | null;
  aniversario?: string | null;
  image?: string | null;
  ordem?: number;
}

// Seed inicial (igual ao que existia no client)
const seed: TeamMember[] = [
  // Sócios
  { section: "Sócios", name: "Júnior Muck", role: "CEO", sede: "SP", admissao: "01/02/1997", aniversario: "02/06/1978", image: "/junior.png" },
  { section: "Sócios", name: "Rose Muck", role: "Cofundadora", sede: "RS", image: "/rose.png" },
  { section: "Sócios", name: "Gerson Muck", role: "Cofundador", sede: "RS", image: "/gerson.png" },
  // Administrativo
  { section: "Administrativo", name: "Gisele Muck", role: "Gerente Financeiro (Supervisora Setor ADM)", is_leader: true, sede: "SP", admissao: "29/01/2020", aniversario: "10/01/1983", image: "/gisele.png" },
  { section: "Administrativo", name: "Juliana de Oliveira Dias Charão", role: "Generalista de RH", sede: "RS", admissao: "01/03/2022", aniversario: "26/10/1982", image: "/juliana.png" },
  { section: "Administrativo", name: "Patricia Fernandes Barbosa", role: "Marketing", sede: "RS", admissao: "18/09/2023", aniversario: "23/04/1999", image: "/patricia.png" },
  // Suporte
  { section: "Suporte", name: "Júnior Muck", role: "Supervisor", is_leader: true, image: "/junior.png" },
  { section: "Suporte", name: "Luís da Silva", role: "Analista de Suporte", is_pj: true, parceria_desde: "01/04/2012", sede: "RS", aniversario: "10/11/1963", image: "/luis-fernando.png" },
  { section: "Suporte", name: "Casiana Walter Braga", role: "Analista de Suporte de Produto", sede: "RS", admissao: "01/04/2013", aniversario: "31/01/1985", image: "/casiana.png" },
  { section: "Suporte", name: "Gabriel Pereira Lazarin", role: "Analista de Suporte de Produto", sede: "SP", admissao: "28/08/2023", aniversario: "19/03/1997", image: "/gabriel-lazarin.png" },
  // Comercial
  { section: "Comercial", name: "Júnior Muck", role: "Supervisor", is_leader: true, image: "/junior.png" },
  { section: "Comercial", name: "Cíntia Villar", role: "Consultor de Vendas", is_pj: true, parceria_desde: "01/09/2021", sede: "RS", aniversario: "10/05/2023", image: "/cintia.png" },
  { section: "Comercial", name: "Jacqueline Fontoura", role: "Consultor de Vendas", is_pj: true, parceria_desde: "13/02/2026", image: "/jacqueline.png" },
  { section: "Comercial", name: "Luiz Fagam", role: "Consultor de Vendas", is_pj: true, parceria_desde: "08/05/2026", image: "/luiz-fagam.png" },
  // Desenvolvimento
  { section: "Desenvolvimento", name: "Ismael Barth Hahn", role: "Coordenador Desenvolvimento", is_leader: true, sede: "RS", admissao: "01/06/2005", aniversario: "09/06/1981", image: "/ismael.png" },
  { section: "Desenvolvimento", name: "Pedro Henrique Lemos", role: "Tech Lead", is_leader: true, sede: "RS", admissao: "01/06/2007", aniversario: "03/06/1987", image: "/pedro.png" },
  { section: "Desenvolvimento", name: "Marcelo Luvizotto", role: "Desenvolvedor", sede: "SP", admissao: "01/06/2023", aniversario: "11/03/1965", image: "/macelo.png" },
  { section: "Desenvolvimento", name: "Éverton Cristiano dos Santos", role: "Desenvolvedor", sede: "RS", admissao: "27/01/2025", aniversario: "06/05/2025", image: "/everton.png" },
  { section: "Desenvolvimento", name: "Douglas Gnutzmann Santos", role: "Desenvolvedor", sede: "RS", admissao: "08/11/2021", aniversario: "24/05/1985", image: "/douglas.png" },
  { section: "Desenvolvimento", name: "João Roberto Teixeira Lopes", role: "Desenvolvedor", sede: "SP", admissao: "01/03/2023", aniversario: "03/06/1986", image: "/joao.png" },
  { section: "Desenvolvimento", name: "Vinícius Martins", role: "Desenvolvedor", sede: "RS", admissao: "18/08/2025", aniversario: "28/08/1996", image: "/vinicius.png" },
  // Qualidade
  { section: "Qualidade", name: "Ismael Barth Hahn", role: "Supervisor", is_leader: true, image: "/ismael.png" },
  { section: "Qualidade", name: "Gabriel Rodrigues Justin", role: "Analista de Testes", sede: "RS", admissao: "18/03/2024", aniversario: "19/08/1995", image: "/gabriel-justin.png" },
  // Implantação
  { section: "Implantação", name: "Júnior Muck", role: "Supervisor", is_leader: true, image: "/junior.png" },
  { section: "Implantação", name: "Marcos Becker", role: "Analista de Implantação", is_pj: true, parceria_desde: "01/04/2019", sede: "RS", aniversario: "18/02/1982", image: "/marcos.png" },
  { section: "Implantação", name: "Renan Pires", role: "Consultor de Implantação", is_pj: true, parceria_desde: "03/06/2024", sede: "SP", aniversario: "25/10/1988", image: "/renan.png" },
  { section: "Implantação", name: "Tatiane", role: "Consultora de Projetos", is_pj: true, parceria_desde: "13/02/2026", sede: "RS", image: "/tatiane.png" },
  // Infraestrutura
  { section: "Infraestrutura", name: "Ismael Barth Hahn", role: "Supervisor", is_leader: true, image: "/ismael.png" },
  { section: "Infraestrutura", name: "Raian Guimarães", role: "Analista de Infraestrutura", sede: "RS", admissao: "08/06/2026", aniversario: "17/02/2003", image: "/raian.png" },
].map((m, i) => ({ ...m, ordem: i }));

export const useTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("section")
        .order("ordem");
      if (error) throw error;
      if (!data || data.length === 0) {
        const { data: inserted } = await supabase
          .from("team_members")
          .insert(seed)
          .select();
        setMembers((inserted as TeamMember[]) || []);
      } else {
        setMembers(data as TeamMember[]);
      }
    } catch (e) {
      console.error("Erro ao carregar equipe:", e);
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

  const addMember = async (m: TeamMember) => {
    const max = members.reduce((a, x) => Math.max(a, x.ordem ?? 0), -1);
    const { error } = await supabase.from("team_members").insert({ ...m, ordem: max + 1 });
    if (error) throw error;
    await fetchAll();
  };

  const updateMember = async (id: string, m: Partial<TeamMember>) => {
    const { error } = await supabase.from("team_members").update(m).eq("id", id);
    if (error) throw error;
    await fetchAll();
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) throw error;
    await fetchAll();
  };

  return { members, loading, addMember, updateMember, deleteMember, refetch: fetchAll };
};

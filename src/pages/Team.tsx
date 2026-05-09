import { Crown, Briefcase, Headphones, TrendingUp, Code2, User, Settings, CheckCircle, MapPin, Calendar, Clock, Cake } from "lucide-react";

interface Member {
  name: string;
  role: string;
  isLeader?: boolean;
  sede?: string;
  admissao?: string;
  tempo?: string;
  aniversario?: string;
}

interface TeamSection {
  title: string;
  icon: any;
  color: string;
  members: Member[];
  highlighted?: boolean;
}

const sections: TeamSection[] = [
  {
    title: "Sócios",
    icon: Crown,
    color: "#f48121",
    highlighted: true,
    members: [
      { name: "Júnior Muck", role: "CEO", sede: "SP", admissao: "01/02/1997", tempo: "29 anos, 3 meses e 8 dias", aniversario: "02/06/2023" },
      { name: "Rose Muck", role: "Cofundadora" },
      { name: "Gerson Muck", role: "Cofundador" },
    ],
  },
  {
    title: "Administrativo",
    icon: Briefcase,
    color: "#38b6ff",
    members: [
      { name: "Gisele Muck", role: "Gerente Financeiro (Supervisora Setor ADM)", isLeader: true, sede: "SP", admissao: "29/01/2020", tempo: "6 anos, 3 meses e 10 dias", aniversario: "10/01/1980" },
      { name: "Juliana de Oliveira Dias Charão", role: "Generalista de RH", sede: "RS", admissao: "01/03/2022", tempo: "4 anos, 2 meses e 8 dias", aniversario: "26/10/1982" },
      { name: "Patricia Fernandes Barbosa Andrade", role: "Auxiliar de Marketing", sede: "RS", admissao: "18/09/2023", tempo: "2 anos, 7 meses e 21 dias", aniversario: "23/04/1999" },
    ],
  },
  {
    title: "Suporte",
    icon: Headphones,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true, sede: "SP", admissao: "01/02/1997", tempo: "29 anos, 3 meses e 8 dias", aniversario: "02/06/2023" },
      { name: "Luís Fernando Teixeira da Silva", role: "Analista de Suporte (PJ)", sede: "RS", admissao: "01/04/2012", tempo: "14 anos, 1 mês e 8 dias", aniversario: "10/11/1963" },
      { name: "Casiana Walter Braga", role: "Analista de Suporte de Produto Pleno N1", sede: "RS", admissao: "01/04/2013", tempo: "13 anos, 1 mês e 8 dias", aniversario: "31/01/1985" },
      { name: "Gabriel Pereira Lazarin", role: "Analista de Suporte de Produto Pleno N1", sede: "SP", admissao: "28/08/2023", tempo: "2 anos, 8 meses e 11 dias", aniversario: "19/03/1997" },
    ],
  },
  {
    title: "Comercial",
    icon: TrendingUp,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true, sede: "SP", admissao: "01/02/1997", tempo: "29 anos, 3 meses e 8 dias", aniversario: "02/06/2023" },
      { name: "Cíntia Villar", role: "Consultor de Vendas (PJ)", sede: "RS", admissao: "01/09/2021", tempo: "4 anos, 8 meses e 8 dias", aniversario: "10/05/2023" },
      { name: "Jacqueline Fontoura", role: "Consultor de Vendas" },
      { name: "Luiz Fagam", role: "Consultor de Vendas" },
    ],
  },
  {
    title: "Desenvolvimento",
    icon: Code2,
    color: "#38b6ff",
    members: [
      { name: "Ismael Barth Hahn", role: "Coordenador Desenvolvimento", isLeader: true, sede: "RS", admissao: "01/06/2005", tempo: "20 anos, 11 meses e 8 dias", aniversario: "09/06/1981" },
      { name: "Pedro Henrique Lemos", role: "Programador Sênior N1 / Tech Lead", isLeader: true, sede: "RS", admissao: "01/06/2007", tempo: "18 anos, 11 meses e 8 dias", aniversario: "03/06/1987" },
      { name: "Marcelo Luvizotto", role: "Programador Pleno N1", sede: "SP", admissao: "01/06/2023", tempo: "2 anos, 11 meses e 8 dias", aniversario: "11/03/1965" },
      { name: "Éverton Cristiano dos Santos", role: "Programador Web Júnior N2", sede: "RS", admissao: "27/01/2025", tempo: "1 ano, 3 meses e 12 dias", aniversario: "06/05/2025" },
      { name: "Douglas Gnutzmann Santos", role: "Programador Pleno N2", sede: "RS", admissao: "08/11/2021", tempo: "4 anos, 6 meses e 1 dia", aniversario: "24/05/1985" },
      { name: "João Roberto Teixeira Lopes", role: "Programador Júnior N1", sede: "SP", admissao: "01/03/2023", tempo: "3 anos, 2 meses e 8 dias", aniversario: "03/06/1986" },
      { name: "Fernanda Spier", role: "Programadora (PJ)", sede: "RS", admissao: "01/01/2025", aniversario: "15/08/1985" },
      { name: "Vinícius Martins", role: "Desenvolvedor" },
    ],
  },
  {
    title: "Implantação",
    icon: Settings,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true, sede: "SP", admissao: "01/02/1997", tempo: "29 anos, 3 meses e 8 dias", aniversario: "02/06/2023" },
      { name: "Marcos Becker", role: "Analista de Implantação (PJ)", sede: "RS", admissao: "01/04/2019", tempo: "7 anos, 1 mês e 8 dias", aniversario: "18/02/1982" },
      { name: "Renan Pires", role: "Consultor de Implantação (PJ)", sede: "SP", admissao: "03/06/2024", tempo: "1 ano, 11 meses e 6 dias", aniversario: "25/10/1988" },
    ],
  },
  {
    title: "Qualidade",
    icon: CheckCircle,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true, sede: "SP", admissao: "01/02/1997", tempo: "29 anos, 3 meses e 8 dias", aniversario: "02/06/2023" },
      { name: "Gabriel Rodrigues Justin", role: "Analista de Testes Júnior N1", sede: "RS", admissao: "18/03/2024", tempo: "2 anos, 1 mês e 21 dias", aniversario: "19/08/1995" },
      { name: "Tatiane", role: "Analista de Qualidade" },
    ],
  },
];

const Team = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-[0_0_15px_rgba(56,182,255,0.4)]">
          EQUIPE
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Conheça quem faz a Embalsoft acontecer
        </p>
      </div>

      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <section key={section.title}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-lg border"
                style={{
                  backgroundColor: `${section.color}15`,
                  borderColor: `${section.color}40`,
                  boxShadow: `0 0 12px ${section.color}30`,
                }}
              >
                <Icon size={20} style={{ color: section.color }} />
              </div>
              <h2
                className="text-xl font-bold uppercase tracking-wider"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              <div
                className="flex-1 h-px"
                style={{ background: `linear-gradient(to right, ${section.color}40, transparent)` }}
              />
              <span className="text-xs text-muted-foreground font-mono">
                {section.members.length} {section.members.length === 1 ? "membro" : "membros"}
              </span>
            </div>

            {/* Líderes / Coordenadores */}
            {section.members.some((m) => m.isLeader) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {section.members
                  .filter((m) => m.isLeader)
                  .map((member, idx) => (
                    <div
                      key={`leader-${idx}`}
                      className="group relative border rounded-lg p-3 transition-all duration-300 hover:-translate-y-1 border-[#38b6ff] bg-[#38b6ff]/80 hover:bg-[#38b6ff] shadow-[0_0_15px_rgba(56,182,255,0.3)] max-w-[280px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 bg-white/20 border-white/40">
                          <User size={20} className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-white font-semibold flex items-center gap-2">
                            <span className="truncate">{member.name}</span>
                            <Crown size={14} className="text-yellow-300 shrink-0" />
                          </h3>
                          <p className="text-xs text-white/80 truncate mt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      {(member.sede || member.admissao || member.tempo || member.aniversario) && (
                        <div className="mt-3 pt-3 border-t border-white/20 space-y-1.5 text-[11px] text-white/90">
                          {member.sede && (
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-white/70 shrink-0" />
                              <span>Sede: {member.sede}</span>
                            </div>
                          )}
                          {member.admissao && (
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-white/70 shrink-0" />
                              <span>Admissão: {member.admissao}</span>
                            </div>
                          )}
                          {member.tempo && (
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-white/70 shrink-0" />
                              <span className="truncate">{member.tempo}</span>
                            </div>
                          )}
                          {member.aniversario && (
                            <div className="flex items-center gap-1.5">
                              <Cake size={12} className="text-white/70 shrink-0" />
                              <span>Aniversário: {member.aniversario}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Funcionários */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.members
                .filter((m) => !m.isLeader)
                .map((member, idx) => (
                  <div
                    key={idx}
                    className={`group relative bg-card/60 backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 ${
                      section.highlighted
                        ? "border-[#f48121]/30 hover:border-[#f48121] hover:shadow-[0_0_25px_rgba(244,129,33,0.25)]"
                        : "border-white/10 hover:border-[#38b6ff]/50 hover:shadow-[0_0_25px_rgba(56,182,255,0.2)]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center border-2 shrink-0"
                        style={{
                          borderColor: `${section.color}50`,
                          background: `linear-gradient(135deg, ${section.color}25, transparent)`,
                        }}
                      >
                        <User size={24} style={{ color: section.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    {(member.sede || member.admissao || member.tempo || member.aniversario) && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-muted-foreground">
                        {member.sede && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} style={{ color: section.color }} className="shrink-0" />
                            <span>Sede: <span className="text-white/90">{member.sede}</span></span>
                          </div>
                        )}
                        {member.admissao && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} style={{ color: section.color }} className="shrink-0" />
                            <span>Admissão: <span className="text-white/90">{member.admissao}</span></span>
                          </div>
                        )}
                        {member.tempo && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} style={{ color: section.color }} className="shrink-0" />
                            <span className="truncate text-white/90">{member.tempo}</span>
                          </div>
                        )}
                        {member.aniversario && (
                          <div className="flex items-center gap-1.5">
                            <Cake size={12} style={{ color: section.color }} className="shrink-0" />
                            <span>Aniversário: <span className="text-white/90">{member.aniversario}</span></span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Team;

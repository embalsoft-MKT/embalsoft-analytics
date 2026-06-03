import { Crown, Briefcase, Headphones, TrendingUp, Code2, User, Settings, CheckCircle, MapPin, Calendar, Clock, Cake, Plus, Server, Handshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Member {
  name: string;
  role: string;
  isLeader?: boolean;
  isPJ?: boolean;
  parceriaDesde?: string;
  sede?: string;
  admissao?: string;
  tempo?: string;
  aniversario?: string;
  image?: string;
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
    color: "#88c240",
    highlighted: true,
    members: [
      { name: "Júnior Muck", role: "CEO", sede: "SP", admissao: "01/02/1997", tempo: "29 anos, 3 meses e 8 dias", aniversario: "02/06/1978", image: "/junior.png" },
      { name: "Rose Muck", role: "Cofundadora", sede: "RS", image: "/rose.png" },
      { name: "Gerson Muck", role: "Cofundador", sede: "RS", image: "/gerson.png" },
    ],
  },
  {
    title: "Administrativo",
    icon: Briefcase,
    color: "#38b6ff",
    members: [
      { name: "Gisele Muck", role: "Gerente Financeiro (Supervisora Setor ADM)", isLeader: true, sede: "SP", admissao: "29/01/2020", tempo: "6 anos, 3 meses e 10 dias", aniversario: "10/01/1983", image: "/gisele.png" },
      { name: "Juliana de Oliveira Dias Charão", role: "Generalista de RH", sede: "RS", admissao: "01/03/2022", tempo: "4 anos, 2 meses e 8 dias", aniversario: "26/10/1982", image: "/juliana.png" },
      { name: "Patricia Fernandes Barbosa", role: "Marketing", sede: "RS", admissao: "18/09/2023", tempo: "2 anos, 7 meses e 21 dias", aniversario: "23/04/1999", image: "/patricia.png" },
    ],
  },
  {
    title: "Suporte",
    icon: Headphones,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true, image: "/junior.png" },
      { name: "Luís da Silva", role: "Analista de Suporte", isPJ: true, parceriaDesde: "01/04/2012", sede: "RS", aniversario: "10/11/1963", image: "/luis-fernando.png" },
      { name: "Casiana Walter Braga", role: "Analista de Suporte de Produto", sede: "RS", admissao: "01/04/2013", tempo: "13 anos, 1 mês e 8 dias", aniversario: "31/01/1985", image: "/casiana.png" },
      { name: "Gabriel Pereira Lazarin", role: "Analista de Suporte de Produto", sede: "SP", admissao: "28/08/2023", tempo: "2 anos, 8 meses e 11 dias", aniversario: "19/03/1997", image: "/gabriel-lazarin.png" },
    ],
  },
  {
    title: "Comercial",
    icon: TrendingUp,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true, image: "/junior.png" },
      { name: "Cíntia Villar", role: "Consultor de Vendas", isPJ: true, parceriaDesde: "01/09/2021", sede: "RS", aniversario: "10/05/2023", image: "/cintia.png" },
      { name: "Jacqueline Fontoura", role: "Consultor de Vendas", isPJ: true, parceriaDesde: "13/02/2026", image: "/jacqueline.png" },
      { name: "Luiz Fagam", role: "Consultor de Vendas", isPJ: true, parceriaDesde: "08/05/2026", image: "/luiz-fagam.png" },
    ],
  },
  {
    title: "Desenvolvimento",
    icon: Code2,
    color: "#38b6ff",
    members: [
      { name: "Ismael Barth Hahn", role: "Coordenador Desenvolvimento", isLeader: true, sede: "RS", admissao: "01/06/2005", tempo: "20 anos, 11 meses e 8 dias", aniversario: "09/06/1981", image: "/ismael.png" },
      { name: "Pedro Henrique Lemos", role: "Tech Lead", isLeader: true, sede: "RS", admissao: "01/06/2007", tempo: "18 anos, 11 meses e 8 dias", aniversario: "03/06/1987", image: "/pedro.png" },
      { name: "Marcelo Luvizotto", role: "Desenvolvedor", sede: "SP", admissao: "01/06/2023", tempo: "2 anos, 11 meses e 8 dias", aniversario: "11/03/1965", image: "/macelo.png" },
      { name: "Éverton Cristiano dos Santos", role: "Desenvolvedor", sede: "RS", admissao: "27/01/2025", tempo: "1 ano, 3 meses e 12 dias", aniversario: "06/05/2025", image: "/everton.png" },
      { name: "Douglas Gnutzmann Santos", role: "Desenvolvedor", sede: "RS", admissao: "08/11/2021", tempo: "4 anos, 6 meses e 1 dia", aniversario: "24/05/1985", image: "/douglas.png" },
      { name: "João Roberto Teixeira Lopes", role: "Desenvolvedor", sede: "SP", admissao: "01/03/2023", tempo: "3 anos, 2 meses e 8 dias", aniversario: "03/06/1986", image: "/joao.png" },
      { name: "Vinícius Martins", role: "Desenvolvedor", sede: "RS", admissao: "18/08/2025", tempo: "9 meses e 16 dias", aniversario: "28/08/1996", image: "/vinicius.png" },
    ],
  },
  {
    title: "Qualidade",
    icon: CheckCircle,
    color: "#38b6ff",
    members: [
      { name: "Ismael Barth Hahn", role: "Supervisor", isLeader: true, image: "/ismael.png" },
      { name: "Gabriel Rodrigues Justin", role: "Analista de Testes", sede: "RS", admissao: "18/03/2024", tempo: "2 anos, 1 mês e 21 dias", aniversario: "19/08/1995", image: "/gabriel-justin.png" },
    ],
  },
  {
    title: "Implantação",
    icon: Settings,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true, image: "/junior.png" },
      { name: "Marcos Becker", role: "Analista de Implantação", isPJ: true, parceriaDesde: "01/04/2019", sede: "RS", aniversario: "18/02/1982", image: "/marcos.png" },
      { name: "Renan Pires", role: "Consultor de Implantação", isPJ: true, parceriaDesde: "03/06/2024", sede: "SP", aniversario: "25/10/1988", image: "/renan.png" },
      { name: "Tatiane", role: "Consultora de Projetos", isPJ: true, parceriaDesde: "13/02/2026", sede: "RS", image: "/tatiane.png" },
    ],
  },
  {
    title: "Infraestrutura",
    icon: Server,
    color: "#38b6ff",
    members: [
      { name: "Ismael Barth Hahn", role: "Supervisor", isLeader: true, image: "/ismael.png" },
      { name: "Raian Guimarães", role: "Analista de Infraestrutura", sede: "RS", admissao: "08/06/2026", aniversario: "17/02/2003", image: "/raian.png" },
    ],
  },
];


const Team = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <div className="relative space-y-8 animate-fade-in pb-20">
      <div className="mt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-8 bg-white rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white drop-shadow-lg">
            EQUIPE EMBALSOFT
          </h1>
        </div>
        <p className="text-muted-foreground font-sans text-sm md:text-base max-w-xl">
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
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 bg-white/20 border-white/40 overflow-hidden">
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={20} className="text-white" />
                          )}
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
                    className={`group relative backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 ${
                      member.isPJ
                        ? "bg-gradient-to-br from-[#88c240]/10 to-card/60 border-dashed border-[#88c240]/40 hover:border-[#88c240] hover:shadow-[0_0_25px_rgba(136,194,64,0.25)]"
                        : section.highlighted
                        ? "bg-card/60 border-[#88c240]/30 hover:border-[#88c240] hover:shadow-[0_0_25px_rgba(244,129,33,0.25)]"
                        : "bg-card/60 border-white/10 hover:border-[#38b6ff]/50 hover:shadow-[0_0_25px_rgba(56,182,255,0.2)]"
                    }`}
                  >
                    {member.isPJ && (
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#88c240]/20 border border-[#88c240]/50 text-[10px] font-semibold text-[#88c240] uppercase tracking-wider">
                        <Handshake size={10} /> Parceiro
                      </span>
                    )}
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center border-2 shrink-0 overflow-hidden"
                        style={{
                          borderColor: member.isPJ ? "#88c24050" : `${section.color}50`,
                          background: member.isPJ
                            ? "linear-gradient(135deg, #88c24025, transparent)"
                            : `linear-gradient(135deg, ${section.color}25, transparent)`,
                        }}
                      >
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} style={{ color: member.isPJ ? "#88c240" : section.color }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {member.role}
                        </p>
                        {member.isPJ && member.parceriaDesde && (
                          <p className="text-[11px] text-[#88c240]/90 mt-0.5 truncate">
                            Parceiro desde {member.parceriaDesde}
                          </p>
                        )}
                      </div>
                    </div>
                    {(member.sede || member.admissao || member.tempo || member.aniversario) && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-muted-foreground">
                        {member.sede && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} style={{ color: member.isPJ ? "#88c240" : section.color }} className="shrink-0" />
                            <span>Sede: <span className="text-white/90">{member.sede}</span></span>
                          </div>
                        )}
                        {member.admissao && !member.isPJ && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} style={{ color: section.color }} className="shrink-0" />
                            <span>Admissão: <span className="text-white/90">{member.admissao}</span></span>
                          </div>
                        )}
                        {member.tempo && !member.isPJ && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} style={{ color: section.color }} className="shrink-0" />
                            <span className="truncate text-white/90">{member.tempo}</span>
                          </div>
                        )}
                        {member.aniversario && (
                          <div className="flex items-center gap-1.5">
                            <Cake size={12} style={{ color: member.isPJ ? "#88c240" : section.color }} className="shrink-0" />
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

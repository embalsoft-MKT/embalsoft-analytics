import { Crown, Briefcase, Headphones, TrendingUp, Code2, User, Settings, CheckCircle } from "lucide-react";

interface Member {
  name: string;
  role: string;
  isLeader?: boolean;
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
      { name: "Júnior Muck", role: "CEO" },
      { name: "Rose Muck", role: "Cofundadora" },
      { name: "Gerson Muck", role: "Cofundador" },
    ],
  },
  {
    title: "Administrativo",
    icon: Briefcase,
    color: "#38b6ff",
    members: [
      { name: "Gisele Muck", role: "Financeiro (Supervisora Setor ADM)", isLeader: true },
      { name: "Juliana Charão", role: "Recursos Humanos" },
      { name: "Patricia Fernandes", role: "Marketing/Design" },
    ],
  },
  {
    title: "Suporte",
    icon: Headphones,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true },
      { name: "Luis Fernando", role: "Analista de Suporte" },
      { name: "Casiana Braga", role: "Analista de Suporte" },
      { name: "Gabriel Lazarin", role: "Analista de Suporte" },
    ],
  },
  {
    title: "Comercial",
    icon: TrendingUp,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true },
      { name: "Cintia Villar", role: "Consultor de Vendas" },
      { name: "Jacqueline Fontoura", role: "Consultor de Vendas" },
      { name: "Luiz Fagam", role: "Consultor de Vendas" },
    ],
  },
  {
    title: "Desenvolvimento",
    icon: Code2,
    color: "#38b6ff",
    members: [
      { name: "Ismael Hahn", role: "Coordenador", isLeader: true },
      { name: "Pedro Lemos", role: "Tech Lead", isLeader: true },
      { name: "Marcelo Luvizotto", role: "Desenvolvedor" },
      { name: "Éverton dos Santos", role: "Desenvolvedor" },
      { name: "Douglas Santos", role: "Desenvolvedor" },
      { name: "João Roberto", role: "Desenvolvedor" },
      { name: "Fernanda Spier", role: "Desenvolvedor" },
      { name: "Vinícius Martins", role: "Desenvolvedor" },
    ],
  },
  {
    title: "Implantação",
    icon: Settings,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true },
      { name: "Marcos Becker", role: "Analista de Implantação" },
      { name: "Renan Pires", role: "Analista de Implantação" },
    ],
  },
  {
    title: "Qualidade",
    icon: CheckCircle,
    color: "#38b6ff",
    members: [
      { name: "Júnior Muck", role: "Supervisor", isLeader: true },
      { name: "Gabriel Justin", role: "Analista de Qualidade" },
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.members.map((member, idx) => {
                const isSupervisor = member.role === "Supervisor";
                return (
                <div
                  key={idx}
                  className={`group relative bg-card/60 backdrop-blur-sm border transition-all duration-300 hover:-translate-y-1 ${
                    isSupervisor ? "rounded-lg p-3" : "rounded-xl p-5"
                  } ${
                    section.highlighted
                      ? "border-[#f48121]/30 hover:border-[#f48121] hover:shadow-[0_0_25px_rgba(244,129,33,0.25)]"
                      : member.isLeader
                      ? "border-yellow-400/40 hover:border-yellow-400 hover:shadow-[0_0_25px_rgba(250,204,21,0.25)] bg-gradient-to-r from-yellow-400/5 to-transparent"
                      : "border-white/10 hover:border-[#38b6ff]/50 hover:shadow-[0_0_25px_rgba(56,182,255,0.2)]"
                  }`}
                >
                  <div className={`flex items-center ${isSupervisor ? "gap-3" : "gap-4"}`}>
                    <div
                      className={`${isSupervisor ? "w-10 h-10 border" : "w-14 h-14 border-2"} rounded-full flex items-center justify-center shrink-0`}
                      style={{
                        borderColor: `${section.color}50`,
                        background: `linear-gradient(135deg, ${section.color}25, transparent)`,
                      }}
                    >
                      <User size={isSupervisor ? 16 : 24} style={{ color: section.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-white font-semibold flex items-center gap-2 ${isSupervisor ? "text-[13px]" : ""}`}>
                        <span className="truncate">{member.name}</span>
                        {member.isLeader && <Crown size={isSupervisor ? 12 : 14} className="text-yellow-400 shrink-0" />}
                      </h3>
                      <p className={`text-muted-foreground truncate mt-0.5 ${isSupervisor ? "text-[10px]" : "text-xs"}`}>
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Team;

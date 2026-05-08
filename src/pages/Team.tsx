import { Crown, Briefcase, Headphones, TrendingUp, Code2, User } from "lucide-react";

interface Member {
  name: string;
  role: string;
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
      { name: "Sócio 1", role: "Diretor" },
      { name: "Sócio 2", role: "Diretor" },
      { name: "Sócio 3", role: "Diretor" },
    ],
  },
  {
    title: "Administrativo",
    icon: Briefcase,
    color: "#38b6ff",
    members: [
      { name: "Membro ADM 1", role: "Administrativo" },
      { name: "Membro ADM 2", role: "Financeiro" },
    ],
  },
  {
    title: "Suporte",
    icon: Headphones,
    color: "#38b6ff",
    members: [
      { name: "Membro Suporte 1", role: "Analista de Suporte" },
      { name: "Membro Suporte 2", role: "Analista de Suporte" },
      { name: "Membro Suporte 3", role: "Analista de Suporte" },
    ],
  },
  {
    title: "Comercial",
    icon: TrendingUp,
    color: "#38b6ff",
    members: [
      { name: "Membro Comercial 1", role: "Consultor de Vendas" },
      { name: "Membro Comercial 2", role: "Consultor de Vendas" },
    ],
  },
  {
    title: "Desenvolvimento",
    icon: Code2,
    color: "#38b6ff",
    members: [
      { name: "Dev 1", role: "Desenvolvedor" },
      { name: "Dev 2", role: "Desenvolvedor" },
      { name: "Dev 3", role: "QA" },
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
              {section.members.map((member, idx) => (
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
                      <h3 className="text-white font-semibold truncate">{member.name}</h3>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>
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

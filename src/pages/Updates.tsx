import React, { useState } from "react";
import { useUpdates, Category, UpdateItem } from "../contexts/UpdatesContext";
import { Check, ChevronDown, ChevronRight, ExternalLink, Calendar, Plus, RefreshCw, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

// Configurations for HUD aesthetics by category
const categoryConfig: Record<Category | 'Todas', { color: string, border: string, bg: string, tag: string }> = {
  'Todas': { color: 'text-white', border: 'border-white/30', bg: 'bg-white/10', tag: 'text-white' },
  'Comunicado': { color: 'text-[#38b6ff]', border: 'border-[#38b6ff]/30', bg: 'bg-[#38b6ff]/10', tag: 'text-[#38b6ff] bg-[#38b6ff]/10 border-[#38b6ff]/30' },
  'Boas práticas': { color: 'text-[#a7c64f]', border: 'border-[#a7c64f]/30', bg: 'bg-[#a7c64f]/10', tag: 'text-[#a7c64f] bg-[#a7c64f]/10 border-[#a7c64f]/30' },
  'Aniversário': { color: 'text-[#f48121]', border: 'border-[#f48121]/30', bg: 'bg-[#f48121]/10', tag: 'text-[#f48121] bg-[#f48121]/10 border-[#f48121]/30' },
  'Feriado': { color: 'text-[#38b6ff]', border: 'border-[#38b6ff]/30', bg: 'bg-[#38b6ff]/10', tag: 'text-[#38b6ff] bg-[#38b6ff]/10 border-[#38b6ff]/30' },
  'Links úteis': { color: 'text-muted-foreground', border: 'border-white/20', bg: 'bg-white/5', tag: 'text-white bg-white/10 border-white/20' }
};

const UpdateCard: React.FC<{ item: UpdateItem }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { markAsRead } = useUpdates();
  const conf = categoryConfig[item.category];

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!item.read) markAsRead(item.id);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border-2 transition-all duration-500 bg-card/60 backdrop-blur-md cursor-pointer group hover:bg-black/80",
        item.read ? "border-white/10 shadow-sm" : cn(conf.border, `shadow-[0_0_15px_${conf.bg.split('/')[0]}] scale-[1.01]`),
        isExpanded ? "pb-6" : ""
      )}
      onClick={handleToggle}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300", item.read ? "bg-white/10" : conf.color.replace('text-', 'bg-'))} />
      
      {/* Canto Super Direito Luz HUD */}
      {!item.read && <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full", conf.color.replace('text-', 'bg-'))} />}

      <div className="p-5 md:p-6 ml-2">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={cn("text-[10px] md:text-xs uppercase font-bold font-mono px-3 py-1 rounded border", conf.tag)}>
                {item.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <Calendar size={14} />
                {item.date}
              </span>
              {!item.read && (
                <span className="animate-pulse bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.8)]">Novo</span>
              )}
            </div>
            
            <h3 className={cn("text-xl md:text-2xl font-bold font-sans tracking-wide transition-colors", item.read ? "text-white/80" : "text-white drop-shadow-md")}>
              {item.title}
            </h3>
            
            <p className="mt-2 text-sm text-muted-foreground font-sans line-clamp-2 md:line-clamp-none">
              {item.shortDescription}
            </p>
          </div>

          <div className="flex items-center self-end md:self-auto shrink-0 border border-white/10 bg-white/5 rounded-full p-2 group-hover:bg-white/10 transition-colors">
            {isExpanded ? <ChevronDown size={20} className="text-white" /> : <ChevronRight size={20} className="text-white" />}
          </div>
        </div>

        {/* Accordion Expand Area */}
        <div className={cn("grid transition-all duration-300 ease-in-out", isExpanded ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <div className="pt-6 border-t border-white/10 text-white/90 font-sans leading-relaxed text-sm md:text-base space-y-4">
              <p>{item.fullContent}</p>
              
              {item.link && (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 mt-4 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white px-4 py-2 rounded transition-all font-bold tracking-wide shadow-[0_0_15px_rgba(56,182,255,0.2)]"
                >
                  ACESSAR LINK <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Updates = () => {
  const { updates, unreadCount, markAllAsRead } = useUpdates();
  const [filter, setFilter] = useState<Category | 'Todas'>('Todas');

  const categories: (Category | 'Todas')[] = ['Todas', 'Comunicado', 'Boas práticas', 'Aniversário', 'Feriado', 'Links úteis'];

  const filteredUpdates = updates.filter(u => filter === 'Todas' || u.category === filter);

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 animate-fade-in-up">
      {/* Header Central HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 mt-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-white rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white drop-shadow-lg flex items-center gap-4">
              ATUALIZAÇÕES
              {unreadCount > 0 && (
                <span className="bg-[#38b6ff] text-secondary-foreground text-sm px-3 py-1 rounded-full font-bold shadow-[0_0_15px_#38b6ff] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <p className="text-muted-foreground font-sans text-sm md:text-base max-w-xl">
            Acompanhe comunicados, datas comemorativas e novidades da plataforma em tempo real.
          </p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#a7c64f] hover:text-white bg-[#a7c64f]/10 border border-[#a7c64f]/30 hover:border-white/50 px-4 py-2.5 rounded transition-all duration-300"
          >
            <Check size={16} />
            Marcar tudo como lido
          </button>
        )}
      </div>

      {/* Tech Pills Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <span className="text-muted-foreground/60 mr-2 border border-muted-foreground/20 bg-black/40 p-2 rounded shadow-inner">
          <Layers size={18} />
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-xs md:text-sm font-bold font-mono tracking-wider border-2 transition-all duration-300",
              filter === cat 
                ? cn(categoryConfig[cat].border, categoryConfig[cat].bg, categoryConfig[cat].color, `shadow-[0_0_15px_${categoryConfig[cat].bg.split('/')[0]}] scale-105`) 
                : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-white bg-black/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Area */}
      {filteredUpdates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-black/30 border border-white/5 rounded-2xl border-dashed">
          <div className="text-muted-foreground/30 mb-6 drop-shadow-md">
             <RefreshCw size={80} className="animate-[spin_10s_linear_infinite]" />
          </div>
          <h3 className="text-2xl font-mono text-white/40 tracking-widest uppercase font-bold text-center">Nenhuma atualização no momento</h3>
          <p className="text-muted-foreground/50 mt-2 font-sans text-sm text-center">O ecossistema está silencioso sob este filtro.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredUpdates.map(item => (
            <UpdateCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Updates;

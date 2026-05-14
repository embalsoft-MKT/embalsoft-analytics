import React, { useState, useEffect } from "react";
import { useUpdates, Category, UpdateItem } from "../contexts/UpdatesContext";
import { useLocation } from "react-router-dom";
import { Check, ChevronDown, ChevronRight, ExternalLink, Calendar, Plus, RefreshCw, Layers, Phone, GraduationCap, BookOpen, Book, Image as ImageIcon, Linkedin, Mail, Cake, Link2, X, Upload, FileText, Trash2, Edit3, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Configurations for HUD aesthetics by category
const categoryConfig: Record<Category | 'Todas', { color: string, border: string, bg: string, tag: string }> = {
  'Todas': { color: 'text-white', border: 'border-white/30', bg: 'bg-white/10', tag: 'text-white' },
  'Comunicado': { color: 'text-[#38b6ff]', border: 'border-[#38b6ff]/30', bg: 'bg-[#38b6ff]/10', tag: 'text-[#38b6ff] bg-[#38b6ff]/10 border-[#38b6ff]/30' },
  'Boas práticas': { color: 'text-[#a7c64f]', border: 'border-[#a7c64f]/30', bg: 'bg-[#a7c64f]/10', tag: 'text-[#a7c64f] bg-[#a7c64f]/10 border-[#a7c64f]/30' },
  'Aniversário': { color: 'text-[#f48121]', border: 'border-[#f48121]/30', bg: 'bg-[#f48121]/10', tag: 'text-[#f48121] bg-[#f48121]/10 border-[#f48121]/30' },
  'Feriado': { color: 'text-[#38b6ff]', border: 'border-[#38b6ff]/30', bg: 'bg-[#38b6ff]/10', tag: 'text-[#38b6ff] bg-[#38b6ff]/10 border-[#38b6ff]/30' },
  'Links úteis': { color: 'text-muted-foreground', border: 'border-white/20', bg: 'bg-white/5', tag: 'text-white bg-white/10 border-white/20' }
};

const UpdateCard: React.FC<{ item: UpdateItem, onEdit: (item: UpdateItem) => void }> = ({ item, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { markAsRead, deleteUpdate } = useUpdates();
  const { isAdmin } = useAuth();
  const conf = categoryConfig[item.category];

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!item.read) markAsRead(item.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir este informativo?")) {
      deleteUpdate(item.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border-2 transition-all duration-500 bg-card/60 backdrop-blur-md cursor-pointer group hover:bg-black/80",
        item.read ? "border-white/10 shadow-sm" : cn(conf.border, "scale-[1.01]"),
        isExpanded ? "pb-6" : ""
      )}
      style={!item.read ? { boxShadow: `0 0 15px ${conf.bg.split('/')[0]}` } : {}}
      onClick={handleToggle}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300", item.read ? "bg-white/10" : conf.color.replace('text-', 'bg-'))} />
      
      {/* Canto Super Direito Luz HUD */}
      {!item.read && <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full", conf.color.replace('text-', 'bg-'))} />}

      <div className="p-5 md:p-6 ml-2">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
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
              
              {(
                <div className="flex items-center gap-2 transition-opacity">
                  <button 
                    onClick={handleEdit}
                    className="p-2 bg-white/5 hover:bg-[#38b6ff]/20 text-white/40 hover:text-[#38b6ff] rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="p-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 rounded-lg transition-all"
                    title="Deletar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
            
            <h3 className={cn("text-xl md:text-2xl font-bold font-sans tracking-wide transition-colors", item.read ? "text-white/80" : "text-white drop-shadow-md")}>
              {item.title}
            </h3>
            
            <p className="mt-2 text-sm text-muted-foreground font-sans line-clamp-2 md:line-clamp-none">
              {item.shortDescription}
            </p>

            {/* Author Info */}
            <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4">
              {item.authorPhoto ? (
                <img src={item.authorPhoto} alt={item.authorName} className="w-6 h-6 rounded-full border border-white/10" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                  <User size={12} />
                </div>
              )}
              <span className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-widest">
                Postado por: <span className="text-white/60">{item.authorName || 'Sistema'}</span>
              </span>
            </div>
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

              {item.imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border border-white/10 max-w-lg">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" />
                </div>
              )}

              {item.fileUrl && (
                <div className="mt-4">
                  <a 
                    href={item.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white px-4 py-2 rounded transition-all font-bold text-xs"
                  >
                    <FileText size={16} /> VER DOCUMENTO (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Updates = () => {
  const { updates, unreadCount, markAllAsRead, addUpdate, updateUpdate } = useUpdates();
  const { isAdmin, user } = useAuth();
  const [filter, setFilter] = useState<Category | 'Todas'>('Todas');
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showLinksPopover, setShowLinksPopover] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Comunicado' as Category,
    shortDescription: '',
    fullContent: '',
    imageUrl: '',
    fileUrl: '',
    link: ''
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openModal) {
      setShowPostModal(true);
      // Clear state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const categories: (Category | 'Todas')[] = ['Todas', 'Comunicado', 'Boas práticas', 'Aniversário', 'Feriado'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUpdate(editingId, newPost);
      setEditingId(null);
    } else {
      addUpdate({
        ...newPost,
        authorName: user?.user_metadata?.full_name || 'Usuário',
        authorPhoto: user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      });
    }
    setShowPostModal(false);
    setNewPost({
      title: '',
      category: 'Comunicado',
      shortDescription: '',
      fullContent: '',
      imageUrl: '',
      fileUrl: '',
      link: ''
    });
  };

  const handleEdit = (item: UpdateItem) => {
    setNewPost({
      title: item.title,
      category: item.category,
      shortDescription: item.shortDescription,
      fullContent: item.fullContent || '',
      imageUrl: item.imageUrl || '',
      fileUrl: item.fileUrl || '',
      link: item.link || ''
    });
    setEditingId(item.id);
    setShowPostModal(true);
  };

  const filteredUpdates = updates.filter(u => filter === 'Todas' || u.category === filter);

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 animate-fade-in-up flex flex-col lg:flex-row-reverse gap-8">
      {/* Sidebar Links Úteis (Restored as sticky card) */}
      <aside className="lg:w-72 shrink-0 lg:sticky lg:top-24 self-start w-full order-1 lg:mt-[228px]">
        <div className="rounded-xl border-2 border-[#38b6ff]/30 bg-card/60 backdrop-blur-md p-5 shadow-[0_0_20px_rgba(56,182,255,0.15)]">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
            <Link2 size={18} className="text-[#38b6ff] drop-shadow-[0_0_5px_rgba(56,182,255,0.8)]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-white">Links úteis</h2>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-black/40 border border-white/5 mb-3">
              <Phone size={16} className="text-[#a7c64f] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">Telefone Voip</span>
                <span className="text-sm text-white font-bold">(51) 2165-6886</span>
              </div>
            </div>

            {[
              { icon: GraduationCap, label: "Embalsoft Academia" },
              { icon: BookOpen, label: "Wiki Antiga" },
              { icon: Book, label: "Wiki Nova" },
              { icon: ImageIcon, label: "Fundo Teams 2026" },
              { icon: Linkedin, label: "Capa LinkedIn" },
              { icon: Mail, label: "Assinaturas de email" },
            ].map((l) => (
              <a key={l.label} href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-[#38b6ff] hover:bg-[#38b6ff]/10 border border-transparent hover:border-[#38b6ff]/30 transition-all group">
                <l.icon size={16} className="shrink-0 text-muted-foreground group-hover:text-[#38b6ff]" />
                <span className="flex-1">{l.label}</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setEditingId(null); setShowPostModal(true); }}
          className="mt-6 w-full flex items-center justify-center gap-4 text-sm font-mono font-black uppercase tracking-[0.2em] bg-[#38b6ff] text-[#0f172a] hover:bg-[#38b6ff]/90 px-4 py-5 rounded-2xl transition-all duration-300 shadow-[0_15px_35px_rgba(56,182,255,0.3)] hover:shadow-[0_20px_45px_rgba(56,182,255,0.4)] hover:-translate-y-1 active:translate-y-0.5"
        >
          <div className="bg-[#0f172a] rounded-full p-1.5 shadow-inner">
            <Plus size={20} strokeWidth={3} className="text-[#38b6ff]" />
          </div>
          Nova Postagem
        </button>
      </aside>

      {/* Main Feed area */}
      <div className="flex-1 min-w-0 order-2 lg:order-1">
      {/* Header Central HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 mt-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-white rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white drop-shadow-lg flex items-center gap-4">
              INFORMATIVOS
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

        <div className="flex flex-col gap-4">
          {/* Header post button removed, moved to sidebar */}
        </div>
      </div>

      {/* Removed Popover as it's now back in the sidebar */}


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
            <UpdateCard key={item.id} item={item} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Modal de Postagem */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0f172a] border-2 border-[#38b6ff]/50 rounded-2xl shadow-[0_0_50px_rgba(56,182,255,0.3)] overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#38b6ff] rounded-full shadow-[0_0_10px_#38b6ff]" />
                <h2 className="text-xl font-bold font-mono tracking-widest text-white uppercase">
                  {editingId ? 'EDITAR POSTAGEM' : 'NOVA POSTAGEM'}
                </h2>
              </div>
              <button onClick={() => { setShowPostModal(false); setEditingId(null); }} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-[#38b6ff] uppercase tracking-wider">Título</label>
                  <input 
                    required
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#38b6ff] outline-none transition-all"
                    placeholder="Ex: Nova regra de firewall"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-[#38b6ff] uppercase tracking-wider">Categoria</label>
                  <select 
                    value={newPost.category}
                    onChange={e => setNewPost({...newPost, category: e.target.value as Category})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#38b6ff] outline-none transition-all"
                  >
                    {categories.filter(c => c !== 'Todas').map(c => (
                      <option key={c} value={c} className="bg-[#0f172a]">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono text-[#38b6ff] uppercase tracking-wider">Descrição Curta</label>
                <input 
                  required
                  value={newPost.shortDescription}
                  onChange={e => setNewPost({...newPost, shortDescription: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#38b6ff] outline-none transition-all"
                  placeholder="Resumo que aparece no card..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono text-[#38b6ff] uppercase tracking-wider">Conteúdo Completo</label>
                <textarea 
                  required
                  rows={4}
                  value={newPost.fullContent}
                  onChange={e => setNewPost({...newPost, fullContent: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#38b6ff] outline-none transition-all resize-none"
                  placeholder="Detalhes completos do informativo..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-[#38b6ff] uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon size={12} /> URL da Imagem
                  </label>
                  <input 
                    value={newPost.imageUrl}
                    onChange={e => setNewPost({...newPost, imageUrl: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#38b6ff] outline-none transition-all text-xs"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-[#38b6ff] uppercase tracking-wider flex items-center gap-2">
                    <FileText size={12} /> URL do PDF
                  </label>
                  <input 
                    value={newPost.fileUrl}
                    onChange={e => setNewPost({...newPost, fileUrl: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#38b6ff] outline-none transition-all text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 px-6 py-3 border border-white/10 rounded-xl font-bold font-mono text-white/60 hover:bg-white/5 transition-all"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 py-3 bg-[#38b6ff] hover:bg-[#38b6ff]/80 text-[#0f172a] rounded-xl font-black font-mono tracking-widest shadow-[0_0_20px_rgba(56,182,255,0.4)] transition-all"
                >
                  {editingId ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR AGORA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Updates;

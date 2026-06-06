import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type Category = 'Comunicado' | 'Aniversário' | 'Feriado' | 'Boas práticas' | 'Links úteis' | 'Bem-estar';

export interface UpdateItem {
  id: string;
  title: string;
  category: Category;
  date: string;
  shortDescription: string;
  fullContent?: string;
  link?: string;
  imageUrl?: string;
  fileUrl?: string;
  read: boolean;
  authorName?: string;
  authorPhoto?: string;
  scheduledDate?: string;
}

interface UpdatesContextType {
  updates: UpdateItem[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addUpdate: (update: Omit<UpdateItem, 'id' | 'read' | 'date'>) => Promise<void>;
  deleteUpdate: (id: string) => Promise<void>;
  updateUpdate: (id: string, update: Partial<UpdateItem>) => Promise<void>;
  refresh: () => Promise<void>;
}

const initialUpdates: UpdateItem[] = [
  {
    id: '1',
    title: 'Nova versão do EmbalConnect liberada',
    category: 'Comunicado',
    date: 'Hoje, 09:00',
    shortDescription: 'A nova arquitetura HUD foi disponibilizada globalmente no servidor principal.',
    fullContent: 'Temos o prazer de anunciar que o novo design system inspirado em interfaces Sci-Fi HUD está oficialmente implantado. Esta atualização altera fortemente a renderização dos relatórios de forma mais chamativa e facilita as respostas em chamados.',
    read: false,
    authorName: 'Adm Embalsoft',
    authorPhoto: '/icon-e.png'
  },
  {
    id: '2',
    title: 'Aniversário do Dev Backend',
    category: 'Aniversário',
    date: 'Ontem',
    shortDescription: 'Hoje é dia do Gabriel, do time de dados!',
    fullContent: 'Deixe um recado na aba geral para o Gabriel parabenizando-o por mais um ciclo. Haverá comemoração na sala de pausas no final do expediente!',
    read: false,
    authorName: 'Adm Embalsoft',
    authorPhoto: '/icon-e.png'
  },
  {
    id: '3',
    title: 'Feriado Nacional prolongado',
    category: 'Feriado',
    date: '12 de Outubro',
    shortDescription: 'Comunicamos que a equipe fará o emendo do feriado.',
    fullContent: 'Não haverá expediente na sexta-feira pós-feriado. O plantão de suporte atuará de forma remota apenas para emergências (SLA > P1) de clientes Premium.',
    read: true,
    authorName: 'Adm Embalsoft',
    authorPhoto: '/icon-e.png'
  },
  {
    id: '4',
    title: 'Otimização de Querys no ERP',
    category: 'Boas práticas',
    date: '10 de Outubro',
    shortDescription: 'Confira as novas regras de ORM impostas pela equipe.',
    fullContent: 'Toda nova consulta ao banco principal do ERP a partir das versões mais novas deverá obedecer o novo limite de tabelas referenciadas, prevenindo bloqueio nas filas. Acesse a documentação técnica abaixo.',
    link: 'https://docs.embalsoft.com',
    read: true,
    authorName: 'Adm Embalsoft',
    authorPhoto: '/icon-e.png'
  },
];

const UpdatesContext = createContext<UpdatesContextType | undefined>(undefined);

export const UpdatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega IDs lidos do localStorage baseando-se no usuário logado
  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`embalsoft_read_updates_${user.id}`);
      if (stored) {
        setReadIds(JSON.parse(stored));
      } else {
        setReadIds([]);
      }
    } else {
      setReadIds([]);
    }
  }, [user?.id]);

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('informativos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category as Category,
        date: d.date,
        shortDescription: d.short_description,
        fullContent: d.full_content || undefined,
        link: d.link || undefined,
        imageUrl: d.image_url || undefined,
        fileUrl: d.file_url || undefined,
        authorName: d.author_name || 'Sistema',
        authorPhoto: d.author_photo || undefined,
        scheduledDate: d.scheduled_date || undefined,
        read: false
      }));

      setUpdates(mapped);
    } catch (e) {
      console.warn("Não foi possível carregar do Supabase, carregando localmente:", e);
      const stored = localStorage.getItem('embalsoft_updates');
      if (stored) {
        setUpdates(JSON.parse(stored));
      } else {
        setUpdates(initialUpdates);
        localStorage.setItem('embalsoft_updates', JSON.stringify(initialUpdates));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  // Seed Links úteis padrão (uma única vez por navegador)
  useEffect(() => {
    if (loading) return;
    const SEED_KEY = 'embalsoft_seed_links_uteis_v1';
    if (localStorage.getItem(SEED_KEY)) return;

    const seeds: Array<{ title: string; link: string; shortDescription: string }> = [
      {
        title: 'Embalsoft Academia',
        link: 'https://academy.embalsoft.com.br/moodle/',
        shortDescription: 'Plataforma de cursos e treinamentos da Embalsoft.'
      },
      {
        title: 'Wiki Nova',
        link: 'http://wiki.embalsoft.int/xwiki/bin/login/XWiki/XWikiLogin;jsessionid=950FED68ED3BD38B8250D2813CA9074C?srid=mXLZMz8g&xredirect=%2Fxwiki%2Fbin%2Fview%2FBase%2520de%2520Conhecimento%2520%2F%3Fsrid%3DmXLZMz8g',
        shortDescription: 'Base de conhecimento interna da Embalsoft.'
      },
      {
        title: 'Fundo Teams 2026',
        link: 'https://embalsoftcombr-my.sharepoint.com/personal/patricia_fernandes_embalsoft_com_br/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fpatricia%5Ffernandes%5Fembalsoft%5Fcom%5Fbr%2FDocuments%2FMateriais%202026%2FArtes%202026%2FFundo%20Teams%202026%2Epng&parent=%2Fpersonal%2Fpatricia%5Ffernandes%5Fembalsoft%5Fcom%5Fbr%2FDocuments%2FMateriais%202026%2FArtes%202026&ga=1',
        shortDescription: 'Plano de fundo oficial para Microsoft Teams - 2026.'
      },
      {
        title: 'Capa Linkedin p/ colaboradores',
        link: 'https://embalsoftcombr-my.sharepoint.com/personal/patricia_fernandes_embalsoft_com_br/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fpatricia%5Ffernandes%5Fembalsoft%5Fcom%5Fbr%2FDocuments%2FMateriais%202026%2FArtes%202026%2FCapa%20linkedin%2Epng&parent=%2Fpersonal%2Fpatricia%5Ffernandes%5Fembalsoft%5Fcom%5Fbr%2FDocuments%2FMateriais%202026%2FArtes%202026&ga=1',
        shortDescription: 'Capa oficial do LinkedIn para colaboradores Embalsoft.'
      },
      {
        title: 'Assinaturas de email',
        link: 'https://embalsoftcombr-my.sharepoint.com/personal/patricia_fernandes_embalsoft_com_br/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fpatricia%5Ffernandes%5Fembalsoft%5Fcom%5Fbr%2FDocuments%2FMateriais%202026%2FArtes%202026%2FAss%20de%20email%202026&ga=1',
        shortDescription: 'Modelos oficiais de assinatura de e-mail 2026.'
      }
    ];

    const missing = seeds.filter(s => !updates.some(u => u.title === s.title));
    if (missing.length === 0) {
      localStorage.setItem(SEED_KEY, '1');
      return;
    }

    (async () => {
      for (const s of missing) {
        await addUpdate({
          title: s.title,
          category: 'Links úteis',
          shortDescription: s.shortDescription,
          link: s.link,
          authorName: 'Adm Embalsoft',
          authorPhoto: '/icon-e.png'
        });
      }
      localStorage.setItem(SEED_KEY, '1');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const updatesWithRead = useMemo(() => {
    return updates.map(u => ({
      ...u,
      read: readIds.includes(u.id)
    }));
  }, [updates, readIds]);

  const unreadCount = useMemo(() => {
    // Apenas conta não lidos que não estão agendados no futuro
    const now = new Date();
    return updatesWithRead.filter(u => {
      const isFuture = u.scheduledDate && new Date(u.scheduledDate) > now;
      return !u.read && !isFuture;
    }).length;
  }, [updatesWithRead]);

  const markAsRead = (id: string) => {
    if (!user?.id) return;
    setReadIds(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(`embalsoft_read_updates_${user.id}`, JSON.stringify(next));
      return next;
    });
  };

  const markAllAsRead = () => {
    if (!user?.id) return;
    const allIds = updates.map(u => u.id);
    setReadIds(allIds);
    localStorage.setItem(`embalsoft_read_updates_${user.id}`, JSON.stringify(allIds));
  };

  const addUpdate = async (update: Omit<UpdateItem, 'id' | 'read' | 'date'>) => {
    const dateStr = new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    try {
      const { data, error } = await supabase
        .from('informativos')
        .insert([{
          title: update.title,
          category: update.category,
          date: dateStr,
          short_description: update.shortDescription,
          full_content: update.fullContent || null,
          link: update.link || null,
          image_url: update.imageUrl || null,
          file_url: update.fileUrl || null,
          author_name: update.authorName || 'Sistema',
          author_photo: update.authorPhoto || null,
          scheduled_date: update.scheduledDate || null
        }])
        .select();

      if (error) throw error;
      await fetchUpdates();
    } catch (e) {
      console.warn("Falha ao salvar no Supabase, salvando localmente:", e);
      const tempId = Math.random().toString(36).substr(2, 9);
      const newItem: UpdateItem = {
        ...update,
        id: tempId,
        read: false,
        date: dateStr
      };
      setUpdates(prev => {
        const next = [newItem, ...prev];
        localStorage.setItem('embalsoft_updates', JSON.stringify(next));
        return next;
      });
    }
  };

  const deleteUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('informativos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchUpdates();
    } catch (e) {
      console.warn("Falha ao deletar do Supabase, deletando localmente:", e);
      setUpdates(prev => {
        const next = prev.filter(u => u.id !== id);
        localStorage.setItem('embalsoft_updates', JSON.stringify(next));
        return next;
      });
    }
  };

  const updateUpdate = async (id: string, update: Partial<UpdateItem>) => {
    try {
      const { error } = await supabase
        .from('informativos')
        .update({
          title: update.title,
          category: update.category,
          short_description: update.shortDescription,
          full_content: update.fullContent || null,
          link: update.link || null,
          image_url: update.imageUrl || null,
          file_url: update.fileUrl || null,
          scheduled_date: update.scheduledDate || null
        })
        .eq('id', id);

      if (error) throw error;
      await fetchUpdates();
    } catch (e) {
      console.warn("Falha ao atualizar no Supabase, atualizando localmente:", e);
      setUpdates(prev => {
        const next = prev.map(u => u.id === id ? { ...u, ...update } : u);
        localStorage.setItem('embalsoft_updates', JSON.stringify(next));
        return next;
      });
    }
  };

  return (
    <UpdatesContext.Provider value={{ 
      updates: updatesWithRead, 
      unreadCount, 
      loading,
      markAsRead, 
      markAllAsRead, 
      addUpdate, 
      deleteUpdate, 
      updateUpdate,
      refresh: fetchUpdates
    }}>
      {children}
    </UpdatesContext.Provider>
  );
};

export const useUpdates = () => {
  const context = useContext(UpdatesContext);
  if (context === undefined) {
    throw new Error('useUpdates must be used within an UpdatesProvider');
  }
  return context;
};

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

const UpdatesContext = createContext<UpdatesContextType | undefined>(undefined);

const mapRow = (d: any): UpdateItem => ({
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
  read: false,
});

export const UpdatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`embalsoft_read_updates_${user.id}`);
      setReadIds(stored ? JSON.parse(stored) : []);
    } else {
      setReadIds([]);
    }
  }, [user?.id]);

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('informativos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar informativos:', error);
      setUpdates([]);
    } else {
      setUpdates((data || []).map(mapRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const updatesWithRead = useMemo(
    () => updates.map(u => ({ ...u, read: readIds.includes(u.id) })),
    [updates, readIds]
  );

  const unreadCount = useMemo(() => {
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
      minute: '2-digit',
    });

    const { error } = await supabase.from('informativos').insert([{
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
      scheduled_date: update.scheduledDate || null,
    }]);

    if (error) {
      console.error('Erro ao criar informativo:', error);
      throw error;
    }
    await fetchUpdates();
  };

  const deleteUpdate = async (id: string) => {
    const { error } = await supabase.from('informativos').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir informativo:', error);
      throw error;
    }
    await fetchUpdates();
  };

  const updateUpdate = async (id: string, update: Partial<UpdateItem>) => {
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
        scheduled_date: update.scheduledDate || null,
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar informativo:', error);
      throw error;
    }
    await fetchUpdates();
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
      refresh: fetchUpdates,
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

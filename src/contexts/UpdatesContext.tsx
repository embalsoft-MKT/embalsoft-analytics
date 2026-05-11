import React, { createContext, useContext, useState, useMemo } from 'react';

export type Category = 'Comunicado' | 'Aniversário' | 'Feriado' | 'Boas práticas' | 'Links úteis';

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
}

interface UpdatesContextType {
  updates: UpdateItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addUpdate: (update: Omit<UpdateItem, 'id' | 'read' | 'date'>) => void;
  deleteUpdate: (id: string) => void;
  updateUpdate: (id: string, update: Partial<UpdateItem>) => void;
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
    authorName: 'Suporte Técnico',
    authorPhoto: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    title: 'Aniversário do Dev Backend',
    category: 'Aniversário',
    date: 'Ontem',
    shortDescription: 'Hoje é dia do Gabriel, do time de dados!',
    fullContent: 'Deixe um recado na aba geral para o Gabriel parabenizando-o por mais um ciclo. Haverá comemoração na sala de pausas no final do expediente!',
    read: false,
    authorName: 'Recursos Humanos',
    authorPhoto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    title: 'Feriado Nacional prolongado',
    category: 'Feriado',
    date: '12 de Outubro',
    shortDescription: 'Comunicamos que a equipe fará o emendo do feriado.',
    fullContent: 'Não haverá expediente na sexta-feira pós-feriado. O plantão de suporte atuará de forma remota apenas para emergências (SLA > P1) de clientes Premium.',
    read: true,
    authorName: 'Administração',
    authorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
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
    authorName: 'Fábrica de Software',
    authorPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop'
  },
];

const UpdatesContext = createContext<UpdatesContextType | undefined>(undefined);

export const UpdatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [updates, setUpdates] = useState<UpdateItem[]>(initialUpdates);

  const unreadCount = useMemo(() => updates.filter(u => !u.read).length, [updates]);

  const markAsRead = (id: string) => {
    setUpdates(prev => 
      prev.map(u => (u.id === id && !u.read ? { ...u, read: true } : u))
    );
  };

  const markAllAsRead = () => {
    setUpdates(prev => prev.map(u => ({ ...u, read: true })));
  };

  const addUpdate = (update: Omit<UpdateItem, 'id' | 'read' | 'date'>) => {
    const newItem: UpdateItem = {
      ...update,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      date: 'Agora mesmo',
    };
    setUpdates(prev => [newItem, ...prev]);
  };
  
  const deleteUpdate = (id: string) => {
    setUpdates(prev => prev.filter(u => u.id !== id));
  };

  const updateUpdate = (id: string, update: Partial<UpdateItem>) => {
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, ...update } : u));
  };

  return (
    <UpdatesContext.Provider value={{ updates, unreadCount, markAsRead, markAllAsRead, addUpdate, deleteUpdate, updateUpdate }}>
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

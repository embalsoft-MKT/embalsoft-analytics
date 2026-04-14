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
  read: boolean;
}

interface UpdatesContextType {
  updates: UpdateItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const initialUpdates: UpdateItem[] = [
  {
    id: '1',
    title: 'Nova versão do Embalsoft Analyze liberada',
    category: 'Comunicado',
    date: 'Hoje, 09:00',
    shortDescription: 'A nova arquitetura HUD foi disponibilizada globalmente no servidor principal.',
    fullContent: 'Temos o prazer de anunciar que o novo design system inspirado em interfaces Sci-Fi HUD está oficialmente implantado. Esta atualização altera fortemente a renderização dos relatórios de forma mais chamativa e facilita as respostas em chamados.',
    read: false,
  },
  {
    id: '2',
    title: 'Aniversário do Dev Backend',
    category: 'Aniversário',
    date: 'Ontem',
    shortDescription: 'Hoje é dia do Gabriel, do time de dados!',
    fullContent: 'Deixe um recado na aba geral para o Gabriel parabenizando-o por mais um ciclo. Haverá comemoração na sala de pausas no final do expediente!',
    read: false,
  },
  {
    id: '3',
    title: 'Feriado Nacional prolongado',
    category: 'Feriado',
    date: '12 de Outubro',
    shortDescription: 'Comunicamos que a equipe fará o emendo do feriado.',
    fullContent: 'Não haverá expediente na sexta-feira pós-feriado. O plantão de suporte atuará de forma remota apenas para emergências (SLA > P1) de clientes Premium.',
    read: true,
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

  return (
    <UpdatesContext.Provider value={{ updates, unreadCount, markAsRead, markAllAsRead }}>
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

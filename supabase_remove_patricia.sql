-- ============================================================
-- Remover Patrícia Fernandes Barbosa da tabela public.team_members
-- Aplicação: aba Equipe do EmbalConnect
-- ============================================================

delete from public.team_members
where section = 'Administrativo'
  and name = 'Patricia Fernandes Barbosa';

-- Conferência
select section, name, role
  from public.team_members
 where section = 'Administrativo'
 order by ordem;

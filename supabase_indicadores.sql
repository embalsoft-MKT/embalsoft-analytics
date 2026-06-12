-- ============================================================
-- Schema: indicadores + indicadores_historico
-- Execute no SQL Editor do seu Supabase
-- ============================================================

create table if not exists public.indicadores (
  id uuid primary key default gen_random_uuid(),
  chave text unique not null,
  label text not null,
  categoria text not null, -- 'comercial' | 'avancos' | 'operacional'
  valor numeric,
  valor_extra text,        -- ex: '+15%', '↑12%'
  ordem int default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.indicadores_historico (
  id uuid primary key default gen_random_uuid(),
  indicador_id uuid not null references public.indicadores(id) on delete cascade,
  chave text not null,
  valor_anterior numeric,
  valor_extra_anterior text,
  valor_novo numeric,
  valor_extra_novo text,
  alterado_em timestamptz not null default now(),
  alterado_por uuid references auth.users(id)
);

create index if not exists idx_hist_indicador on public.indicadores_historico(indicador_id, alterado_em desc);

-- RLS
alter table public.indicadores enable row level security;
alter table public.indicadores_historico enable row level security;

-- Grants
grant all privileges on public.indicadores to authenticated, service_role;
grant all privileges on public.indicadores_historico to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

drop policy if exists "ind_select" on public.indicadores;
create policy "ind_select" on public.indicadores for select to authenticated using (true);

drop policy if exists "ind_update" on public.indicadores;
create policy "ind_update" on public.indicadores for update to authenticated using (true) with check (true);

drop policy if exists "ind_insert" on public.indicadores;
create policy "ind_insert" on public.indicadores for insert to authenticated with check (true);

drop policy if exists "hist_select" on public.indicadores_historico;
create policy "hist_select" on public.indicadores_historico for select to authenticated using (true);

drop policy if exists "hist_insert" on public.indicadores_historico;
create policy "hist_insert" on public.indicadores_historico for insert to authenticated with check (true);

-- Trigger: salva valor anterior em indicadores_historico
create or replace function public.log_indicador_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (old.valor is distinct from new.valor)
     or (old.valor_extra is distinct from new.valor_extra) then
    insert into public.indicadores_historico
      (indicador_id, chave, valor_anterior, valor_extra_anterior,
       valor_novo, valor_extra_novo, alterado_por)
    values
      (old.id, old.chave, old.valor, old.valor_extra,
       new.valor, new.valor_extra, auth.uid());
    new.updated_at := now();
    new.updated_by := coalesce(auth.uid(), new.updated_by);
  end if;
  return new;
end $$;

drop trigger if exists trg_indicador_change on public.indicadores;
create trigger trg_indicador_change
before update on public.indicadores
for each row execute function public.log_indicador_change();

-- Seed inicial (somente se não existir)
insert into public.indicadores (chave, label, categoria, valor, valor_extra, ordem) values
  ('com_novos_erp',       'Novos Clientes ERP',  'comercial',  12,  '+15%', 1),
  ('com_novos_fabrica',   'Fábrica de Software', 'comercial',  5,   '+8%',  2),
  ('av_crm',              'CRM 2.0',             'avancos',    80,  null,   1),
  ('av_bi',               'BI nativo do ERP',    'avancos',    10,  null,   2),
  ('av_ia',               'Agentes de IA',       'avancos',    5,   null,   3),
  ('op_entregas',         'Entregas Realizadas', 'operacional',155, null,   1),
  ('op_retrabalho',       'Retrabalho',          'operacional',8.5, '%',    2),
  ('op_chamados',         'Chamados Atendidos',  'operacional',555, '↑12%', 3)
on conflict (chave) do nothing;

-- ============================================================
-- Tabela: informativos (Updates / Avisos)
-- ============================================================

create table if not exists public.informativos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  date text not null,
  short_description text not null,
  full_content text,
  link text,
  image_url text,
  file_url text,
  author_name text,
  author_photo text,
  scheduled_date timestamptz,
  created_at timestamptz not null default now()
);

-- RLS para informativos
alter table public.informativos enable row level security;

-- Grants para informativos
grant all privileges on public.informativos to authenticated, service_role;

-- Policies para informativos
-- Autorização centralizada exclusivamente em profiles.role = 'admin'
drop policy if exists "inf_select"    on public.informativos;
drop policy if exists "inf_all_admin" on public.informativos;

create policy "inf_select"
  on public.informativos
  for select
  to authenticated
  using (true);

create policy "inf_all_admin"
  on public.informativos
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
       where profiles.id = auth.uid()
         and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
       where profiles.id = auth.uid()
         and profiles.role = 'admin'
    )
  );

-- ============================================================
-- Tabela: team_members (Equipe)
-- ============================================================
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  name text not null,
  role text not null,
  is_leader boolean default false,
  is_pj boolean default false,
  parceria_desde text,
  sede text,
  admissao text,
  aniversario text,
  image text,
  ordem int default 0,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;
grant all privileges on public.team_members to authenticated, service_role;

drop policy if exists "tm_select" on public.team_members;
create policy "tm_select" on public.team_members for select to authenticated using (true);

drop policy if exists "tm_all_admin" on public.team_members;
create policy "tm_all_admin" on public.team_members for all to authenticated using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  or auth.jwt() ->> 'email' in ('embalsofterp@gmail.com', 'embalsoft.erp@gmail.com', 'patricia.fernandes@embalsoft.com.br')
) with check (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  or auth.jwt() ->> 'email' in ('embalsofterp@gmail.com', 'embalsoft.erp@gmail.com', 'patricia.fernandes@embalsoft.com.br')
);

-- ============================================================
-- Tabela: implantacoes (Projetos em Implantação)
-- ============================================================
create table if not exists public.implantacoes (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  etapa text not null,
  status text not null,
  responsavel text,
  ordem int default 0,
  created_at timestamptz not null default now()
);

alter table public.implantacoes enable row level security;
grant all privileges on public.implantacoes to authenticated, service_role;

drop policy if exists "impl_select" on public.implantacoes;
create policy "impl_select" on public.implantacoes for select to authenticated using (true);

drop policy if exists "impl_all_admin" on public.implantacoes;
create policy "impl_all_admin" on public.implantacoes for all to authenticated using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  or auth.jwt() ->> 'email' in ('embalsofterp@gmail.com', 'embalsoft.erp@gmail.com', 'patricia.fernandes@embalsoft.com.br')
) with check (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  or auth.jwt() ->> 'email' in ('embalsofterp@gmail.com', 'embalsoft.erp@gmail.com', 'patricia.fernandes@embalsoft.com.br')
);



-- ============================================================
-- Histórico de "Chamados Atendidos" (chave: op_chamados)
-- Tickets do Suporte por mês — Março, Abril e Maio/2025
-- Usa exclusivamente o indicador já existente (op_chamados)
-- ============================================================

-- Atualiza valor atual do indicador EXISTENTE para Maio/2025
update public.indicadores
   set valor = 286,
       valor_extra = null
 where chave = 'op_chamados';

-- Limpa históricos manuais anteriores (idempotente)
delete from public.indicadores_historico
 where chave = 'op_chamados'
   and alterado_em in (
     '2025-03-31 23:59:00-03'::timestamptz,
     '2025-04-30 23:59:00-03'::timestamptz,
     '2025-05-31 23:59:00-03'::timestamptz
   );

-- Insere registros históricos (Março=466, Abril=289, Maio=286)
insert into public.indicadores_historico
  (indicador_id, chave, valor_anterior, valor_extra_anterior,
   valor_novo, valor_extra_novo, alterado_em)
select i.id, 'op_chamados', v.valor_anterior, null, v.valor_novo, null, v.alterado_em
  from public.indicadores i
  cross join (values
    (null::numeric, 466::numeric, '2025-03-31 23:59:00-03'::timestamptz),
    (466::numeric,  289::numeric, '2025-04-30 23:59:00-03'::timestamptz),
    (289::numeric,  286::numeric, '2025-05-31 23:59:00-03'::timestamptz)
  ) as v(valor_anterior, valor_novo, alterado_em)
 where i.chave = 'op_chamados';


-- ============================================================
-- SEED: team_members (Equipe) — dados originais recuperados
-- Idempotente: só insere se a tabela estiver vazia
-- ============================================================
insert into public.team_members (section, name, role, is_leader, is_pj, parceria_desde, sede, admissao, aniversario, image, ordem)
select * from (values
  ('Sócios', 'Júnior Muck', 'CEO', false, false, null, 'SP', '01/02/1997', '02/06/1978', '/junior.png', 1),
  ('Sócios', 'Rose Muck', 'Cofundadora', false, false, null, 'RS', null, null, '/rose.png', 2),
  ('Sócios', 'Gerson Muck', 'Cofundador', false, false, null, 'RS', null, null, '/gerson.png', 3),
  ('Administrativo', 'Gisele Muck', 'Gerente Financeiro/Coordenadora ADM', true, false, null, 'SP', '29/01/2020', '10/01/1983', '/gisele.png', 1),
  ('Administrativo', 'Juliana de Oliveira Dias Charão', 'Generalista de RH', false, false, null, 'RS', '01/03/2022', '26/10/1982', '/juliana.png', 2),
  ('Administrativo', 'Patricia Fernandes Barbosa', 'Marketing', false, false, null, 'RS', '18/09/2023', '23/04/1999', '/patricia.png', 3),
  ('Suporte', 'Júnior Muck', 'Coordenador', true, false, null, null, null, null, '/junior.png', 1),
  ('Suporte', 'Luís da Silva', 'Analista de Suporte', false, true, '01/04/2012', 'RS', null, '10/11/1963', '/luis-fernando.png', 2),
  ('Suporte', 'Casiana Walter Braga', 'Analista de Suporte de Produto', false, false, null, 'RS', '01/04/2013', '31/01/1985', '/casiana.png', 3),
  ('Suporte', 'Gabriel Pereira Lazarin', 'Analista de Suporte de Produto', false, false, null, 'SP', '28/08/2023', '19/03/1997', '/gabriel-lazarin.png', 4),
  ('Comercial', 'Júnior Muck', 'Coordenador', true, false, null, null, null, null, '/junior.png', 1),
  ('Comercial', 'Cíntia Villar', 'Consultor de Vendas', false, true, '01/09/2021', 'RS', null, '10/05/2023', '/cintia.png', 2),
  ('Comercial', 'Jacqueline Fontoura', 'Consultor de Vendas', false, true, '13/02/2026', null, null, null, '/jacqueline.png', 3),
  ('Comercial', 'Luiz Fagam', 'Consultor de Vendas', false, true, '08/05/2026', null, null, null, '/luiz-fagam.png', 4),
  ('Desenvolvimento', 'Ismael Barth Hahn', 'Coordenador Desenvolvimento', true, false, null, 'RS', '01/06/2005', '09/06/1981', '/ismael.png', 1),
  ('Desenvolvimento', 'Pedro Henrique Lemos', 'Tech Lead', true, false, null, 'RS', '01/06/2007', '03/06/1987', '/pedro.png', 2),
  ('Desenvolvimento', 'Marcelo Luvizotto', 'Desenvolvedor', false, false, null, 'SP', '01/06/2023', '11/03/1965', '/macelo.png', 3),
  ('Desenvolvimento', 'Éverton Cristiano dos Santos', 'Desenvolvedor', false, false, null, 'RS', '27/01/2025', '06/05/2025', '/everton.png', 4),
  ('Desenvolvimento', 'Douglas Gnutzmann Santos', 'Desenvolvedor', false, false, null, 'RS', '08/11/2021', '24/05/1985', '/douglas.png', 5),
  ('Desenvolvimento', 'João Roberto Teixeira Lopes', 'Desenvolvedor', false, false, null, 'SP', '01/03/2023', '03/06/1986', '/joao.png', 6),
  ('Desenvolvimento', 'Vinícius Martins', 'Desenvolvedor', false, false, null, 'RS', '18/08/2025', '28/08/1996', '/vinicius.png', 7),
  ('Qualidade', 'Ismael Barth Hahn', 'Coordenador', true, false, null, null, null, null, '/ismael.png', 1),
  ('Qualidade', 'Gabriel Rodrigues Justin', 'Analista de Testes', false, false, null, 'RS', '18/03/2024', '19/08/1995', '/gabriel-justin.png', 2),
  ('Implantação', 'Júnior Muck', 'Coordenador', true, false, null, null, null, null, '/junior.png', 1),
  ('Implantação', 'Marcos Becker', 'Analista de Implantação', false, true, '01/04/2019', 'RS', null, '18/02/1982', '/marcos.png', 2),
  ('Implantação', 'Renan Pires', 'Consultor de Implantação', false, true, '03/06/2024', 'SP', null, '25/10/1988', '/renan.png', 3),
  ('Implantação', 'Tatiane', 'Consultora de Projetos', false, true, '13/02/2026', 'RS', null, null, '/tatiane.png', 4),
  ('Infraestrutura', 'Ismael Barth Hahn', 'Coordenador', true, false, null, null, null, null, '/ismael.png', 1),
  ('Infraestrutura', 'Raian Guimarães', 'Analista de Infraestrutura', false, false, null, 'RS', '08/06/2026', '17/02/2003', '/raian.png', 2)
) as seed(section, name, role, is_leader, is_pj, parceria_desde, sede, admissao, aniversario, image, ordem)
where not exists (select 1 from public.team_members);

-- Recarregar o cache do PostgREST (necessário após criar a tabela)
notify pgrst, 'reload schema';

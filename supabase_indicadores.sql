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
  ('erp',                 'Novos Clientes ERP',          'comercial',  12,  '+15%', 1),
  ('fabrica',             'Serviços TEC (em andamento)', 'comercial',  1,   '-50%',  2),
  ('av_crm',              'CRM 2.0',             'avancos',    80,  null,   1),
  ('av_bi',               'BI nativo do ERP',    'avancos',    10,  null,   2),
  ('av_ia',               'Agentes de IA',       'avancos',    5,   null,   3),
  ('op_entregas',         'Evolutivas',          'operacional',155, null,   1),
  ('op_retrabalho',       'Corretivas',          'operacional',8.5, '%',    2),
  ('op_chamados',         'Chamados Atendidos',  'operacional',555, '↑12%', 3)
on conflict (chave) do nothing;

-- Atualiza labels e chaves já existentes no banco (renomeação)
do $$
begin
  if exists (select 1 from public.indicadores where chave = 'com_novos_erp') and not exists (select 1 from public.indicadores where chave = 'erp') then
    update public.indicadores set chave = 'erp' where chave = 'com_novos_erp';
  end if;

  if exists (select 1 from public.indicadores where chave = 'com_novos_fabrica') and not exists (select 1 from public.indicadores where chave = 'fabrica') then
    update public.indicadores set chave = 'fabrica', label = 'Serviços TEC (em andamento)' where chave = 'com_novos_fabrica';
  end if;
end $$;

update public.indicadores set label = 'Evolutivas'  where chave = 'op_entregas'  and label = 'Entregas Realizadas';
update public.indicadores set label = 'Corretivas'  where chave = 'op_retrabalho' and label = 'Retrabalho';
update public.indicadores set label = 'Evolutivas'  where chave = 'entregas'  and label = 'Entregas Realizadas';
update public.indicadores set label = 'Corretivas'  where chave = 'retrabalho' and label = 'Retrabalho';
update public.indicadores set label = 'Serviços TEC (em andamento)', valor = 1, valor_extra = '-50%' where chave = 'fabrica';

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
-- Histórico de "Serviços TEC (em andamento)" (chave: fabrica)
-- ============================================================

-- Garante valor atualizado
update public.indicadores
   set valor = 1,
       valor_extra = '-50%'
 where chave = 'fabrica';

-- Limpa históricos manuais anteriores (idempotente)
delete from public.indicadores_historico
 where chave = 'fabrica';

-- Insere registro histórico (Ano Passado=2, Atual=1)
insert into public.indicadores_historico
  (indicador_id, chave, valor_anterior, valor_extra_anterior,
   valor_novo, valor_extra_novo, alterado_em)
select id, 'fabrica', 2, null, 1, '-50%', now() - interval '6 months'
  from public.indicadores
 where chave = 'fabrica';


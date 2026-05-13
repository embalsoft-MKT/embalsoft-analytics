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

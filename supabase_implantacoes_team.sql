-- ============================================================
-- Schema: implantacoes + team_members
-- Execute no SQL Editor do seu Supabase
-- ============================================================

create table if not exists public.implantacoes (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  etapa text not null,
  status text not null, -- 'em_dia' | 'atencao' | 'atrasado'
  responsavel text,
  ordem int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_team_section on public.team_members(section, ordem);
create index if not exists idx_implantacoes_ordem on public.implantacoes(ordem);

-- RLS
alter table public.implantacoes enable row level security;
alter table public.team_members enable row level security;

-- Grants
grant select, insert, update, delete on public.implantacoes to authenticated;
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.implantacoes to service_role;
grant all on public.team_members to service_role;

-- Policies (authenticated users can read/write; UI restringe escrita a admin)
drop policy if exists "implantacoes_all" on public.implantacoes;
create policy "implantacoes_all" on public.implantacoes for all to authenticated using (true) with check (true);

drop policy if exists "team_members_all" on public.team_members;
create policy "team_members_all" on public.team_members for all to authenticated using (true) with check (true);

-- Trigger updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_impl_touch on public.implantacoes;
create trigger trg_impl_touch before update on public.implantacoes
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_team_touch on public.team_members;
create trigger trg_team_touch before update on public.team_members
  for each row execute function public.touch_updated_at();

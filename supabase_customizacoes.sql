-- =========================================================
-- Tabela: public.customizacoes
-- Lista de customizações em andamento exibida no card
-- "Customizações" do bloco Desenvolvimento e QA.
-- =========================================================

create table if not exists public.customizacoes (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  descricao text not null default '',
  responsavel text not null default '',
  status text not null default 'em_andamento',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger para manter updated_at
create or replace function public.customizacoes_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_customizacoes_updated_at on public.customizacoes;
create trigger trg_customizacoes_updated_at
before update on public.customizacoes
for each row execute function public.customizacoes_set_updated_at();

-- Grants Data API
grant select, insert, update, delete on public.customizacoes to authenticated;
grant select on public.customizacoes to anon;
grant all on public.customizacoes to service_role;

-- RLS
alter table public.customizacoes enable row level security;

drop policy if exists "customizacoes_select_all" on public.customizacoes;
create policy "customizacoes_select_all"
  on public.customizacoes for select
  to anon, authenticated
  using (true);

drop policy if exists "customizacoes_insert_auth" on public.customizacoes;
create policy "customizacoes_insert_auth"
  on public.customizacoes for insert
  to authenticated
  with check (true);

drop policy if exists "customizacoes_update_auth" on public.customizacoes;
create policy "customizacoes_update_auth"
  on public.customizacoes for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "customizacoes_delete_auth" on public.customizacoes;
create policy "customizacoes_delete_auth"
  on public.customizacoes for delete
  to authenticated
  using (true);

-- Realtime
alter publication supabase_realtime add table public.customizacoes;

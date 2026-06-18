-- ============================================================
-- Ajuste: Dashboard "Desenvolvimento e QA"
-- - Renomeia "Entregas Realizadas" -> "Evolutiva" (chave: op_entregas / entregas)
-- - Renomeia "Retrabalho"          -> "Corretivas" (chave: op_retrabalho / retrabalho)
-- - Adiciona indicador "Customizações" (chave: customizacoes)
-- Execute no SQL Editor do Supabase.
-- ============================================================

-- Renomeia labels existentes (cobre as duas convenções de chave usadas no projeto)
update public.indicadores
   set label = 'Evolutiva'
 where chave in ('entregas', 'op_entregas');

update public.indicadores
   set label = 'Corretivas'
 where chave in ('retrabalho', 'op_retrabalho');

-- Insere novo indicador "Customizações" (idempotente)
insert into public.indicadores (chave, label, categoria, valor, valor_extra, ordem)
values ('customizacoes', 'Customizações', 'operacional', 0, null, 3)
on conflict (chave) do update
  set label = excluded.label,
      categoria = excluded.categoria,
      ordem = excluded.ordem;

-- ============================================================
-- Atualiza Painel Comercial: Clientes ERP
-- Total de 5 novos clientes em 2026:
--   1 em fevereiro, 2 em março, 2 em junho
-- Execute no SQL Editor do Lovable Cloud / Supabase
-- ============================================================

-- 1) Desativa trigger de histórico automático para atualizar o valor
--    sem gerar um registro de histórico indesejado.
alter table public.indicadores disable trigger trg_indicador_change;

-- 2) Atualiza o valor atual do indicador ERP
update public.indicadores
   set valor      = 5,
       valor_extra = null,
       updated_at  = now()
 where chave = 'erp';

-- 3) Reativa trigger de histórico
alter table public.indicadores enable trigger trg_indicador_change;

-- 4) Remove históricos anteriores do indicador ERP
delete from public.indicadores_historico
 where chave = 'erp';

-- 5) Insere histórico mensal (2026) para compor o total do ano
insert into public.indicadores_historico
  (indicador_id, chave, valor_anterior, valor_extra_anterior,
   valor_novo, valor_extra_novo, alterado_em)
select i.id, 'erp', v.valor_anterior, null, v.valor_novo, null, v.alterado_em
  from public.indicadores i
  cross join (values
    (null::numeric, 1::numeric, '2026-02-28 23:59:00-03'::timestamptz),
    (1::numeric,    2::numeric, '2026-03-31 23:59:00-03'::timestamptz),
    (3::numeric,    2::numeric, '2026-06-30 23:59:00-03'::timestamptz)
  ) as v(valor_anterior, valor_novo, alterado_em)
 where i.chave = 'erp';

-- 6) Confere resultado
select id, chave, label, valor, valor_extra
  from public.indicadores
 where chave = 'erp';

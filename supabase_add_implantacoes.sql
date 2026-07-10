-- Adiciona 3 novos projetos de implantação
-- Executar no SQL Editor do Supabase

insert into public.implantacoes (empresa, etapa_atual, status, responsavel, ordem)
values
  ('Rican',      'Go Live',  'em_dia', 'Renan', 10),
  ('Ondulapel',  'Simulado', 'em_dia', 'Renan', 11),
  ('Novaconpel', 'Simulado', 'em_dia', 'Renan', 12);

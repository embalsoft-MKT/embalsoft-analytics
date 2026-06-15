-- ============================================================
-- Seed idempotente para public.team_members (29 colaboradores)
-- Pré-requisito: tabela public.team_members já existe.
-- ============================================================

-- 1) Constraint UNIQUE(section, name) para suportar ON CONFLICT
do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conname = 'team_members_section_name_key'
  ) then
    alter table public.team_members
      add constraint team_members_section_name_key unique (section, name);
  end if;
end $$;

-- 2) Inclusão na publicação supabase_realtime (idempotente)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'team_members'
  ) then
    alter publication supabase_realtime add table public.team_members;
  end if;
end $$;

alter table public.team_members replica identity full;

-- 3) Seed dos 29 colaboradores (idempotente)
insert into public.team_members
  (section, name, role, is_leader, is_pj, parceria_desde, sede, admissao, aniversario, image, ordem)
values
  -- Sócios (3)
  ('Sócios','Júnior Muck','CEO',false,false,null,'SP','01/02/1997','02/06/1978','/junior.png',1),
  ('Sócios','Rose Muck','Cofundadora',false,false,null,'RS',null,null,'/rose.png',2),
  ('Sócios','Gerson Muck','Cofundador',false,false,null,'RS',null,null,'/gerson.png',3),

  -- Administrativo (3)
  ('Administrativo','Gisele Muck','Gerente Financeiro/Coordenadora ADM',true,false,null,'SP','29/01/2020','10/01/1983','/gisele.png',1),
  ('Administrativo','Juliana de Oliveira Dias Charão','Generalista de RH',false,false,null,'RS','01/03/2022','26/10/1982','/juliana.png',2),
  ('Administrativo','Patricia Fernandes Barbosa','Marketing',false,false,null,'RS','18/09/2023','23/04/1999','/patricia.png',3),

  -- Suporte (4)
  ('Suporte','Júnior Muck','Coordenador',true,false,null,null,null,null,'/junior.png',1),
  ('Suporte','Luís da Silva','Analista de Suporte',false,true,'01/04/2012','RS',null,'10/11/1963','/luis-fernando.png',2),
  ('Suporte','Casiana Walter Braga','Analista de Suporte de Produto',false,false,null,'RS','01/04/2013','31/01/1985','/casiana.png',3),
  ('Suporte','Gabriel Pereira Lazarin','Analista de Suporte de Produto',false,false,null,'SP','28/08/2023','19/03/1997','/gabriel-lazarin.png',4),

  -- Comercial (4)
  ('Comercial','Júnior Muck','Coordenador',true,false,null,null,null,null,'/junior.png',1),
  ('Comercial','Cíntia Villar','Consultor de Vendas',false,true,'01/09/2021','RS',null,'10/05/2023','/cintia.png',2),
  ('Comercial','Jacqueline Fontoura','Consultor de Vendas',false,true,'13/02/2026',null,null,null,'/jacqueline.png',3),
  ('Comercial','Luiz Fagam','Consultor de Vendas',false,true,'08/05/2026',null,null,null,'/luiz-fagam.png',4),

  -- Desenvolvimento (7)
  ('Desenvolvimento','Ismael Barth Hahn','Coordenador Desenvolvimento',true,false,null,'RS','01/06/2005','09/06/1981','/ismael.png',1),
  ('Desenvolvimento','Pedro Henrique Lemos','Tech Lead',true,false,null,'RS','01/06/2007','03/06/1987','/pedro.png',2),
  ('Desenvolvimento','Marcelo Luvizotto','Desenvolvedor',false,false,null,'SP','01/06/2023','11/03/1965','/macelo.png',3),
  ('Desenvolvimento','Éverton Cristiano dos Santos','Desenvolvedor',false,false,null,'RS','27/01/2025','06/05/2025','/everton.png',4),
  ('Desenvolvimento','Douglas Gnutzmann Santos','Desenvolvedor',false,false,null,'RS','08/11/2021','24/05/1985','/douglas.png',5),
  ('Desenvolvimento','João Roberto Teixeira Lopes','Desenvolvedor',false,false,null,'SP','01/03/2023','03/06/1986','/joao.png',6),
  ('Desenvolvimento','Vinícius Martins','Desenvolvedor',false,false,null,'RS','18/08/2025','28/08/1996','/vinicius.png',7),

  -- Qualidade (2)
  ('Qualidade','Ismael Barth Hahn','Coordenador',true,false,null,null,null,null,'/ismael.png',1),
  ('Qualidade','Gabriel Rodrigues Justin','Analista de Testes',false,false,null,'RS','18/03/2024','19/08/1995','/gabriel-justin.png',2),

  -- Implantação (4)
  ('Implantação','Júnior Muck','Coordenador',true,false,null,null,null,null,'/junior.png',1),
  ('Implantação','Marcos Becker','Analista de Implantação',false,true,'01/04/2019','RS',null,'18/02/1982','/marcos.png',2),
  ('Implantação','Renan Pires','Consultor de Implantação',false,true,'03/06/2024','SP',null,'25/10/1988','/renan.png',3),
  ('Implantação','Tatiane','Consultora de Projetos',false,true,'13/02/2026','RS',null,null,'/tatiane.png',4),

  -- Infraestrutura (2)
  ('Infraestrutura','Ismael Barth Hahn','Coordenador',true,false,null,null,null,null,'/ismael.png',1),
  ('Infraestrutura','Raian Guimarães','Analista de Infraestrutura',false,false,null,'RS','08/06/2026','17/02/2003','/raian.png',2)
on conflict (section, name) do nothing;

-- Conferência
select section, count(*) as qtd
  from public.team_members
 group by section
 order by section;

select count(*) as total from public.team_members;

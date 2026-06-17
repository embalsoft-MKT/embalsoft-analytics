-- Ajusta o caminho da imagem do Marcelo Luvizotto para apontar para o arquivo correto no git (marcelo.png)
update public.team_members
   set image = '/marcelo.png'
 where section = 'Desenvolvimento'
   and name = 'Marcelo Luvizotto';

-- Conferência
select section, name, image
  from public.team_members
 where name = 'Marcelo Luvizotto';

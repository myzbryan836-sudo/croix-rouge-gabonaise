-- ============================================================================
-- Croix-Rouge Gabonaise — Schéma Supabase (PostgreSQL)
-- ============================================================================
-- À exécuter une fois dans l'éditeur SQL de votre projet Supabase
-- (https://app.supabase.com/project/_/sql/new), ou via `supabase db push`
-- si vous utilisez la CLI.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Table des profils utilisateurs (liée à auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.utilisateurs (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  nom text,
  role text not null default 'membre' check (role in ('membre', 'admin')),
  cree_le timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. Contenu public (géré par l'admin)
-- ----------------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  titre text,
  extrait text,
  contenu text,
  image_url text,
  categorie text,
  date text,
  statut text default 'brouillon',
  cree_le timestamptz not null default now()
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  titre text,
  badge text,
  description text,
  image_url text,
  icone text,
  actions text[] default '{}',
  stat text,
  statut text default 'brouillon',
  ordre integer default 0,
  cree_le timestamptz not null default now()
);

create table if not exists public.annonces (
  id uuid primary key default gen_random_uuid(),
  titre text,
  description text,
  image_url text,
  lien text,
  type text,
  statut text default 'brouillon',
  ordre integer default 0,
  cree_le timestamptz not null default now()
);

create table if not exists public.contenus (
  id uuid primary key default gen_random_uuid(),
  cle text,
  titre text,
  valeur text,
  section text,
  cree_le timestamptz not null default now()
);

create table if not exists public.statistiques_impact (
  id uuid primary key default gen_random_uuid(),
  label text,
  valeur numeric default 0,
  suffixe text default '',
  ordre integer default 0,
  cree_le timestamptz not null default now()
);

create table if not exists public.zones_intervention (
  id uuid primary key default gen_random_uuid(),
  province text,
  ville text,
  quartier text,
  gps_lat numeric,
  gps_lng numeric,
  description text,
  image_url text,
  type_intervention text,
  etat_intervention text default 'en_cours' check (etat_intervention in ('en_cours', 'terminee')),
  statut text default 'brouillon',
  ordre integer default 0,
  cree_le timestamptz not null default now()
);

-- Migration : si la table existait déjà sans la colonne etat_intervention
alter table public.zones_intervention add column if not exists etat_intervention text default 'en_cours';
alter table public.zones_intervention drop constraint if exists zones_intervention_etat_intervention_check;
alter table public.zones_intervention add constraint zones_intervention_etat_intervention_check
  check (etat_intervention in ('en_cours', 'terminee'));

create table if not exists public.partenaires (
  id uuid primary key default gen_random_uuid(),
  nom text,
  logo_url text,
  description text,
  categorie text check (categorie in ('institution_publique', 'entreprise', 'ong', 'organisation_internationale', 'partenaire_technique_financier')),
  lien text,
  statut text default 'brouillon',
  ordre integer default 0,
  cree_le timestamptz not null default now()
);

create table if not exists public.galerie_medias (
  id uuid primary key default gen_random_uuid(),
  titre text,
  type text default 'photo' check (type in ('photo', 'video')),
  url text,
  categorie text check (categorie in ('interventions', 'campagnes', 'formations', 'benevoles', 'evenements')),
  statut text default 'brouillon',
  ordre integer default 0,
  cree_le timestamptz not null default now()
);

create table if not exists public.reseaux_sociaux (
  id uuid primary key default gen_random_uuid(),
  plateforme text not null,
  url text,
  actif boolean default true,
  ordre integer default 0,
  cree_le timestamptz not null default now()
);

-- Ligne unique de coordonnées de contact (numéro vert, WhatsApp, email, adresse, GPS, horaires)
create table if not exists public.contact_infos (
  id integer primary key default 1,
  numero_vert text,
  whatsapp text,
  email text,
  adresse text,
  gps_lat numeric,
  gps_lng numeric,
  horaires text,
  maj_le timestamptz not null default now(),
  constraint contact_infos_singleton check (id = 1)
);
insert into public.contact_infos (id) values (1) on conflict (id) do nothing;

-- Ligne unique de configuration des moyens de paiement (numéros mobile money,
-- coordonnées bancaires pour virement / carte réglés manuellement par l'admin)
create table if not exists public.moyens_paiement (
  id integer primary key default 1,
  moov_money_numero text,
  moov_money_titulaire text,
  airtel_money_numero text,
  airtel_money_titulaire text,
  banque_nom text,
  banque_titulaire text,
  banque_numero_compte text,
  banque_iban text,
  instructions_carte text,
  maj_le timestamptz not null default now(),
  constraint moyens_paiement_singleton check (id = 1)
);
insert into public.moyens_paiement (id) values (1) on conflict (id) do nothing;

create table if not exists public.ressources (
  id uuid primary key default gen_random_uuid(),
  titre text,
  description text,
  fichier_url text,
  image_url text,
  categorie text check (categorie in ('rapport', 'publication', 'document_officiel', 'photo', 'video')),
  statut text default 'brouillon',
  ordre integer default 0,
  cree_le timestamptz not null default now()
);

-- Migration : si la table existait déjà sans la colonne image_url
alter table public.ressources add column if not exists image_url text;

-- ----------------------------------------------------------------------------
-- 3. Soumissions publiques (formulaires du site)
-- ----------------------------------------------------------------------------
create table if not exists public.dons (
  id uuid primary key default gen_random_uuid(),
  montant numeric,
  type text,
  methode text,
  nom_donateur text,
  email_donateur text,
  telephone_donateur text,
  statut text default 'en_attente',
  cree_le timestamptz not null default now()
);

create table if not exists public.candidatures_benevoles (
  id uuid primary key default gen_random_uuid(),
  nom text,
  email text,
  telephone text,
  ville text,
  disponibilites text[] default '{}',
  competences text,
  motivation text,
  statut text default 'nouveau',
  cree_le timestamptz not null default now()
);

create table if not exists public.signalements (
  id uuid primary key default gen_random_uuid(),
  nom text,
  email text,
  telephone text,
  type_urgence text,
  localisation text,
  description text,
  statut text default 'nouveau',
  cree_le timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. Fonction utilitaire : l'utilisateur courant est-il admin ?
--    SECURITY DEFINER : contourne le RLS de "utilisateurs" pour éviter toute
--    récursion lors de son utilisation dans les politiques ci-dessous.
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.utilisateurs
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- 5. Création automatique du profil "utilisateurs" à l'inscription
--    (remplace le setDoc manuel fait côté client avec Firebase)
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.utilisateurs (id, email, nom, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'nom', ''), 'membre')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 6. Row Level Security
-- ----------------------------------------------------------------------------
alter table public.utilisateurs enable row level security;
alter table public.articles enable row level security;
alter table public.missions enable row level security;
alter table public.annonces enable row level security;
alter table public.contenus enable row level security;
alter table public.statistiques_impact enable row level security;
alter table public.reseaux_sociaux enable row level security;
alter table public.contact_infos enable row level security;
alter table public.moyens_paiement enable row level security;
alter table public.ressources enable row level security;
alter table public.partenaires enable row level security;
alter table public.galerie_medias enable row level security;
alter table public.zones_intervention enable row level security;
alter table public.dons enable row level security;
alter table public.candidatures_benevoles enable row level security;
alter table public.signalements enable row level security;

-- utilisateurs : chacun lit/modifie son profil, l'admin lit tout
drop policy if exists "utilisateurs_select" on public.utilisateurs;
create policy "utilisateurs_select" on public.utilisateurs
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "utilisateurs_update" on public.utilisateurs;
create policy "utilisateurs_update" on public.utilisateurs
  for update using (auth.uid() = id);

-- Contenu public en lecture (utilisé par le site vitrine + le tableau de bord admin)
-- écriture réservée aux admins
drop policy if exists "articles_select" on public.articles;
create policy "articles_select" on public.articles for select using (true);
drop policy if exists "articles_write" on public.articles;
create policy "articles_write" on public.articles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "missions_select" on public.missions;
create policy "missions_select" on public.missions for select using (true);
drop policy if exists "missions_write" on public.missions;
create policy "missions_write" on public.missions for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "annonces_select" on public.annonces;
create policy "annonces_select" on public.annonces for select using (true);
drop policy if exists "annonces_write" on public.annonces;
create policy "annonces_write" on public.annonces for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contenus_select" on public.contenus;
create policy "contenus_select" on public.contenus for select using (true);
drop policy if exists "contenus_write" on public.contenus;
create policy "contenus_write" on public.contenus for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "statistiques_impact_select" on public.statistiques_impact;
create policy "statistiques_impact_select" on public.statistiques_impact for select using (true);
drop policy if exists "statistiques_impact_write" on public.statistiques_impact;
create policy "statistiques_impact_write" on public.statistiques_impact for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reseaux_sociaux_select" on public.reseaux_sociaux;
create policy "reseaux_sociaux_select" on public.reseaux_sociaux for select using (true);
drop policy if exists "reseaux_sociaux_write" on public.reseaux_sociaux;
create policy "reseaux_sociaux_write" on public.reseaux_sociaux for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contact_infos_select" on public.contact_infos;
create policy "contact_infos_select" on public.contact_infos for select using (true);
drop policy if exists "contact_infos_write" on public.contact_infos;
create policy "contact_infos_write" on public.contact_infos for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "moyens_paiement_select" on public.moyens_paiement;
create policy "moyens_paiement_select" on public.moyens_paiement for select using (true);
drop policy if exists "moyens_paiement_write" on public.moyens_paiement;
create policy "moyens_paiement_write" on public.moyens_paiement for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "ressources_select" on public.ressources;
create policy "ressources_select" on public.ressources for select using (true);
drop policy if exists "ressources_write" on public.ressources;
create policy "ressources_write" on public.ressources for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "partenaires_select" on public.partenaires;
create policy "partenaires_select" on public.partenaires for select using (true);
drop policy if exists "partenaires_write" on public.partenaires;
create policy "partenaires_write" on public.partenaires for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "galerie_medias_select" on public.galerie_medias;
create policy "galerie_medias_select" on public.galerie_medias for select using (true);
drop policy if exists "galerie_medias_write" on public.galerie_medias;
create policy "galerie_medias_write" on public.galerie_medias for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "zones_intervention_select" on public.zones_intervention;
create policy "zones_intervention_select" on public.zones_intervention for select using (true);
drop policy if exists "zones_intervention_write" on public.zones_intervention;
create policy "zones_intervention_write" on public.zones_intervention for all using (public.is_admin()) with check (public.is_admin());

-- Soumissions publiques : création ouverte à tous (y compris visiteurs anonymes),
-- lecture/mise à jour/suppression réservées aux admins
drop policy if exists "dons_insert" on public.dons;
create policy "dons_insert" on public.dons for insert with check (true);
drop policy if exists "dons_admin" on public.dons;
create policy "dons_admin" on public.dons for select using (public.is_admin());
drop policy if exists "dons_update" on public.dons;
create policy "dons_update" on public.dons for update using (public.is_admin());
drop policy if exists "dons_delete" on public.dons;
create policy "dons_delete" on public.dons for delete using (public.is_admin());

drop policy if exists "candidatures_insert" on public.candidatures_benevoles;
create policy "candidatures_insert" on public.candidatures_benevoles for insert with check (true);
drop policy if exists "candidatures_admin" on public.candidatures_benevoles;
create policy "candidatures_admin" on public.candidatures_benevoles for select using (public.is_admin());
drop policy if exists "candidatures_update" on public.candidatures_benevoles;
create policy "candidatures_update" on public.candidatures_benevoles for update using (public.is_admin());
drop policy if exists "candidatures_delete" on public.candidatures_benevoles;
create policy "candidatures_delete" on public.candidatures_benevoles for delete using (public.is_admin());

drop policy if exists "signalements_insert" on public.signalements;
create policy "signalements_insert" on public.signalements for insert with check (true);
drop policy if exists "signalements_admin" on public.signalements;
create policy "signalements_admin" on public.signalements for select using (public.is_admin());
drop policy if exists "signalements_update" on public.signalements;
create policy "signalements_update" on public.signalements for update using (public.is_admin());
drop policy if exists "signalements_delete" on public.signalements;
create policy "signalements_delete" on public.signalements for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. Temps réel (équivalent des écouteurs onSnapshot de Firestore)
--    (boucle avec vérification préalable : ALTER PUBLICATION ... ADD TABLE ne
--    supporte pas IF NOT EXISTS, donc on l'émule pour pouvoir rejouer ce script
--    sans erreur "already member of publication")
-- ----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'public.articles', 'public.missions', 'public.annonces', 'public.contenus',
    'public.statistiques_impact', 'public.dons', 'public.candidatures_benevoles',
    'public.signalements', 'public.reseaux_sociaux', 'public.contact_infos',
    'public.ressources', 'public.partenaires', 'public.galerie_medias',
    'public.zones_intervention', 'public.moyens_paiement'
  ]
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and (schemaname || '.' || tablename) = t
    ) then
      execute format('alter publication supabase_realtime add table %s', t);
    end if;
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 8. Stockage des fichiers (images/vidéos) — équivalent Firebase Storage
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ============================================================================
-- Fin du script. Pour créer le premier compte admin, voir le README.
-- ============================================================================

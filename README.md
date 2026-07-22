# Croix-Rouge Gabonaise — Application Web

Application web complète (React + Vite + Supabase) pour la Croix-Rouge Gabonaise.

## Stack
React 18 · Vite · Tailwind CSS · Supabase (PostgreSQL, Auth, Storage) · Framer Motion · React Router DOM v6 · Lucide React

> Ce projet utilisait auparavant Firebase. Il a été migré vers **Supabase**,
> dont l'offre gratuite (base PostgreSQL 500 Mo, 1 Go de stockage de fichiers,
> 50 000 utilisateurs actifs/mois côté auth) ne demande aucune carte bancaire
> et ne bascule jamais automatiquement vers un plan payant.

## Démarrage

```bash
npm install
cp .env.example .env   # renseignez vos clés Supabase
npm run dev
```

## Configuration Supabase (gratuite)

1. Créez un compte et un projet sur https://supabase.com (offre "Free", sans
   carte bancaire requise).
2. Dans **Project Settings → API**, récupérez :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`
   Renseignez ces valeurs dans votre fichier `.env` (voir `.env.example`).
3. Ouvrez **SQL Editor** dans le tableau de bord Supabase, collez le contenu
   de `supabase/schema.sql` et exécutez-le. Ce script crée :
   - toutes les tables (articles, missions, annonces, contenus, dons,
     candidatures_benevoles, signalements, statistiques_impact, utilisateurs)
   - les règles de sécurité (Row Level Security), équivalentes aux anciennes
     `firestore.rules`
   - le trigger qui crée automatiquement un profil `utilisateurs` (rôle
     `membre` par défaut) dès qu'un compte s'inscrit
   - le bucket de stockage public `media` et ses règles d'accès
   - l'activation du temps réel sur les tables (équivalent des écouteurs
     `onSnapshot` de Firestore)
4. Dans **Authentication → Providers**, activez **Email** et, si besoin,
   **Google** (renseignez le Client ID / Secret OAuth Google).
5. Dans **Authentication → URL Configuration**, ajoutez l'URL de votre site
   (ex. `http://localhost:5173` en développement) aux "Redirect URLs".

## Créer le premier compte admin

Inscrivez-vous via `/inscription`, puis dans **Table Editor → utilisateurs**
sur Supabase, changez la colonne `role` de `membre` à `admin` pour votre
compte. Ce compte pourra ensuite accéder à `/admin` et promouvoir d'autres
administrateurs directement depuis la même table.

## Paiements (Moov Money, Airtel Money, cartes bancaires)

Le formulaire `/dons` enregistre chaque demande de don dans la table `dons`
avec le statut `en_attente`. **L'appel réel aux API de paiement (Stripe, Moov
Money, Airtel Money) doit être fait côté serveur** (par exemple une
[Supabase Edge Function](https://supabase.com/docs/guides/functions)),
jamais depuis le client, pour protéger vos clés secrètes. Le flux
recommandé :

1. Le client crée la ligne `dons` (déjà implémenté)
2. Une Edge Function déclenchée par un webhook de base de données appelle le
   fournisseur de paiement choisi
3. Un webhook du fournisseur met à jour le statut du don (`complete` /
   `echoue`)

Ce dépôt fournit la structure de données et l'UI ; l'intégration serveur des
paiements est à brancher selon vos identifiants marchands Moov Money / Airtel
Money et votre compte Stripe.

## Structure du projet

```
src/
  supabase/       config du client Supabase
  context/        AuthContext (connexion, inscription, rôle admin)
  hooks/          useSupabaseCollection (lecture + temps réel)
  components/
    layout/       Navbar, Footer, Layout
    home/         sections de la page d'accueil
    shared/       Logo, ProtectedRoute, bouton "Cri d'alerte"
    admin/        DataTable (CRUD générique), StatusTable, onglets admin
  pages/          Home, Missions, Actualites, ArticleDetail, Dons, Benevoles,
                  Login, Register, ForgotPassword, Admin
supabase/
  schema.sql      tables, sécurité (RLS), trigger de profil, stockage, temps réel
```

## Rôle admin & routes protégées

`/admin` est protégée par `ProtectedRoute` : seul un utilisateur connecté dont
la ligne `utilisateurs.role === 'admin'` peut y accéder. Toutes les écritures
sur les tables publiques (missions, articles, annonces, contenus,
statistiques) sont également restreintes aux admins via les politiques RLS
définies dans `supabase/schema.sql`.

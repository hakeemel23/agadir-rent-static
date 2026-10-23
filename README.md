# Car Rental Template - Static White Label (Next.js 16 + Cloudflare Pages)

Template Next.js 16 ultra-performant, mobile-first et optimise pour la conversion WhatsApp directe, specialement concu pour les agences de location de voitures au Maroc.

Entierement statique (output: 'export'), il est taille pour un hebergement gratuit, securise et instantane sur Cloudflare Pages.

---

## Points Forts

- WhatsApp-First Conversion : Formulaire de reservation interactif calculant automatiquement la duree, le prix total en MAD/EUR, et generant un message WhatsApp structure.
- Support Trilingue & RTL Natif : Francais, Anglais et Arabe avec inversion de direction (dir="rtl") sans rechargement de page.
- Hebergement 100% Statique : Zero cout d'infrastructure serveur, resistant aux pics de trafic grace au CDN mondial de Cloudflare.
- Cache Optimise : En-tetes _headers preconfigures pour un cache immuable d'un an sur tous les bundles Next.js.
- Build Guard Integre : Systeme de securite interdisant le deploiement en production si des donnees demo persistent.
- SEO & Landing Pages Statiques : Generation automatique de pages dediees (/[slug]) par aeroport (si la ville en a un) ou par livraison aeroport (vers les aeroports de livraison deliveryAirports si la ville n'en a pas), ville et modalite sans caution.
- Logique Aeroport en 2 reglages : CITY_HAS_AIRPORT (la ville a son propre aeroport) et AIRPORT_SERVICE (livraison aeroport avec listing precis des aeroports desservis si la ville n'en possede pas).

---

## Stack Technique

- Framework : Next.js 16.4 (App Router, Turbopack, Static HTML Export)
- Interface : React 19.3, Tailwind CSS v4
- Typage : TypeScript 5.1+
- Traitement d'images : Sharp (compression WebP automatisee)
- Deploiement : Cloudflare Pages via Wrangler CLI

---

## Architecture du Projet

public/
  fleet/               Images WebP des voitures
  _headers             Regles de securite et cache Cloudflare Pages
  hero.webp            Image d'accueil optimisee
  logo.png             Logo de la marque
  meeting-point.webp   Photo du point de rencontre aeroport
  og-hero.jpg          Banniere OpenGraph pour partages reseaux sociaux
src/
  app/
    [slug]/page.tsx    Landing pages generees statiquement
    layout.tsx         Structure globale, polices et JSON-LD Schema
    page.tsx           Page d'accueil principale
    robots.ts          Configuration dynamique de robots.txt
    sitemap.ts         Generateur de sitemap.xml
  components/          Composants UI (Hero, Fleet, Conditions, FAQ...)
  context/             Contexte de reservation (dates, devises, lieux)
  data/
    config.ts          POINT CENTRAL : toute la configuration client
    guard.ts           Verificateur de conformite pre-build
    landings.ts        Definition des pages de destination SEO
    translations.ts    Dictionnaires FR / EN / AR
  lib/                 Utilitaires (dates, devises, formateur WhatsApp)
compress.mjs           Script de conversion et compression d'images
next.config.ts         Configuration Next.js en export statique

---

## Commandes Principales

- Developpement local :
  npm run dev

- Traitement des images :
  npm run images

- Build Demo (Mode Test & Validation Client) :
  npm run build:demo

- Build Production :
  npm run build

---

## Deploiement sur Cloudflare Pages

Le deploiement se fait directement depuis votre terminal WSL sans necessiter de serveur distant.

1. Connexion initiale a Cloudflare :
   npx wrangler login

2. Deploiement d'une version de Demo (Preview) :
   Pour montrer le site au client avant officialisation (Build Guard desactive et indexation Google bloquee) :
   npm run build:demo
   npx wrangler pages deploy out --project-name=nom-client --branch=preview

3. Deploiement Officiel en Production :
   Une fois le client d'accord et verified.* mis a true dans config.ts :
   npm run build
   npx wrangler pages deploy out --project-name=nom-client --branch=main

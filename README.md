# 🚗 Car Rental Template - Static White Label (Next.js 16 + Cloudflare Pages)

Template Next.js 16 ultra-performant, mobile-first et optimisé pour la conversion WhatsApp directe, spécialement conçu pour les agences de location de voitures au Maroc[cite: 3]. 

Entièrement statique (`output: 'export'`), il est taillé pour un hébergement gratuit, sécurisé et instantané sur **Cloudflare Pages**[cite: 3].

---

## 🌟 Points Forts

- **WhatsApp-First Conversion** : Formulaire de réservation interactif calculant automatiquement la durée, le prix total en MAD/EUR, et générant un message WhatsApp structuré[cite: 3].
- **Support Trilingue & RTL Natif** : Français, Anglais et Arabe avec inversion de direction (`dir="rtl"`) sans rechargement de page[cite: 3].
- **Hébergement 100% Statique** : Zéro coût d'infrastructure serveur, résistant aux pics de trafic grâce au CDN mondial de Cloudflare.
- **Cache Optimisé** : En-têtes `_headers` préconfigurés pour un cache immuable d'un an (`Cache-Control: public, max-age=31536000, immutable`) sur tous les bundles Next.js[cite: 3].
- **Build Guard Intégré** : Système de sécurité interdisant le déploiement en production si des données démo (`CHANGE-ME`, faux numéros, faux liens) persistent[cite: 3].
- **SEO & Landing Pages Statiques** : Génération automatique de pages dédiées (`/[slug]`) par aéroport, ville et modalité sans caution[cite: 3].

---

## 🛠 Stack Technique

- **Framework** : Next.js 16.4 (App Router, Turbopack, Static HTML Export)[cite: 3]
- **Interface** : React 19.3, Tailwind CSS v4[cite: 3]
- **Typage** : TypeScript 5.1+[cite: 3]
- **Traitement d'images** : Sharp (compression WebP automatisée)[cite: 3]
- **Déploiement** : Cloudflare Pages via Wrangler CLI[cite: 3]

---

## 📁 Architecture du Projet

```text
├── public/
│   ├── fleet/               # Images WebP des voitures
│   ├── _headers             # Règles de sécurité et cache Cloudflare Pages
│   ├── hero.webp            # Image d'accueil optimisée
│   ├── logo.png             # Logo de la marque
│   ├── meeting-point.webp   # Photo du point de rencontre aéroport
│   └── og-hero.jpg          # Bannière OpenGraph pour partages réseaux sociaux
├── src/
│   ├── app/
│   │   ├── [slug]/page.tsx  # Landing pages générées statiquement
│   │   ├── layout.tsx       # Structure globale, polices et JSON-LD Schema
│   │   ├── page.tsx         # Page d'accueil principale
│   │   ├── robots.ts        # Configuration dynamique de robots.txt
│   │   └── sitemap.ts       # Générateur de sitemap.xml
│   ├── components/          # Composants UI (Hero, Fleet, Conditions, FAQ...)
│   ├── context/             # Contexte de réservation (dates, devises, lieux)
│   ├── data/
│   │   ├── config.ts        # POINT CENTRAL : toute la configuration client
│   │   ├── guard.ts         # Vérificateur de conformité pré-build
│   │   ├── landings.ts      # Définition des pages de destination SEO
│   │   └── translations.ts  # Dictionnaires FR / EN / AR
│   └── lib/                 # Utilitaires (dates, devises, formateur WhatsApp)
├── compress.mjs             # Script de conversion et compression d'images
└── next.config.ts           # Configuration Next.js en export statique
```

---

## ⚡ Commandes Principales

### Développement local
```bash
npm run dev
```
Lance le serveur de développement local sur `http://localhost:3000`.

### Traitement des images
Placez vos fichiers sources (`hero.jpg`, `meeting-point.jpg`, et les véhicules dans `public/fleet/`), puis exécutez[cite: 3] :
```bash
npm run images
```
Ce script redimensionne et convertit automatiquement vos images en format WebP optimisé pour le web[cite: 3].

### Build Démo (Mode Test & Validation Client)
Permet de compiler le site avec des données fictives tout en forçant `noindex` pour éviter l'indexation par Google[cite: 3] :
```bash
npm run build:demo
```

### Build Production
Génère le dossier statique `/out` pour la production. Échoue si `verified.*` est à `false` dans `src/data/config.ts`[cite: 3] :
```bash
npm run build
```

---

## 🚀 Déploiement sur Cloudflare Pages

Le déploiement se fait directement depuis votre terminal WSL sans nécessiter de serveur distant.

### 1. Connexion initiale à Cloudflare
```bash
npx wrangler login
```

### 2. Déploiement du site client
Après avoir exécuté `npm run build` (ou `npm run build:demo`) :
```bash
npx wrangler pages deploy out --project-name=nom-client --branch=main
```

> **Note :** L'argument `--branch=main` garantit que le déploiement est considéré comme la version de production officielle du projet sur Cloudflare Pages.

---

## 🔒 Sécurité Anti-Démo (Build Guard)

Le fichier `src/data/guard.ts` inspecte les données avant la compilation finale de production[cite: 3]. Il bloque automatiquement le build si[cite: 3] :
1. `verified.businessInfo`, `verified.legalClaims`, `verified.fleet` ou `verified.seo` sont à `false`[cite: 3].
2. Des valeurs par défaut comme `CHANGE-ME`, `YOUR BRAND` ou `212600000000` sont détectées[cite: 3].
3. Les coordonnées GPS (`geo`) sont à zéro ou invalides[cite: 3].
4. Des images déclarées dans la flotte n'existent pas dans le dossier `public/`[cite: 3].
# 🚀 Checklist de Déploiement Client (Next.js Static + Cloudflare Pages)

Ce guide récapitule toutes les étapes nécessaires pour configurer et déployer un nouveau client à partir de ce template.

---

## 1. Initialisation du projet client
- [ ] Cliquer sur **Use this template** sur GitHub pour créer le dépôt du client (ex: `nom-agence-site`).
- [ ] Cloner le projet en local dans WSL : `git clone <url-du-repo>`.
- [ ] Installer les dépendances : `npm install`.

---

## 2. Configuration Métier (`src/data/config.ts`)

### A. Statut Aéroport & Localisation
- [ ] `HAS_AIRPORT` : mettre à `true` si livraison à l'aéroport, `false` si agence purement urbaine[cite: 3].
- [ ] `seo.city` et `seo.cityAr` : nom de la ville principale (ex: Agadir / أكادير)[cite: 3].
- [ ] `seo.region` : région administrative (ex: Souss-Massa)[cite: 3].
- [ ] `seo.areas` et `seo.areasAr` : zones couvertes en respectant la parité exacte (ex: Taghazout, Aourir)[cite: 3].
- [ ] `seo.airport`, `seo.airportAr`, `seo.airportCode`, `seo.meetingPoint`, `seo.meetingPointAr` (obligatoires si `HAS_AIRPORT = true`)[cite: 3].

### B. Informations de Marque & Contact
- [ ] `brand.name` + `brand.nameLight` : séparer le nom principal et son extension stylisée[cite: 3].
- [ ] `website.url` : URL définitive du client avec HTTPS (ex: `[https://nomagence.ma](https://nomagence.ma)`)[cite: 3].
- [ ] `website.contentUpdated` : date du jour au format `YYYY-MM-DD`[cite: 3].
- [ ] `contact.whatsapp` : format international sans `+` (ex: `2126XXXXXXXX`)[cite: 3].
- [ ] `contact.phone` : format international avec `+` (ex: `+2126XXXXXXXX`)[cite: 3].
- [ ] `contact.phoneDisplay` : format lisible avec espaces (doit correspondre exactement aux chiffres de `phone`)[cite: 3].
- [ ] `contact.address` : adresse physique réelle[cite: 3].
- [ ] `contact.geo` : latitude et longitude GPS réelles (ne pas laisser à 0,0)[cite: 3].
- [ ] `contact.googleMapsLink` : lien Maps HTTPS valide vers l'agence ou le point de rencontre[cite: 3].
- [ ] `contact.sameAs` : liens vers les réseaux sociaux réels du client (ou tableau vide `[]`)[cite: 3].

### C. Règles de Réservation & Flotte
- [ ] `booking.withCaution` : `false` pour "Sans caution", `true` avec caution[cite: 3].
- [ ] `booking.advancePaymentDh` : montant d'acompte en DH, ou `null` si aucun acompte[cite: 3].
- [ ] `booking.freeCancellation`, `unlimitedKm`, `freeAirportDelivery`, `freeCityDelivery`, `insuranceIncluded`[cite: 3].
- [ ] `business.openingHours` : format strict `HH:MM-HH:MM` (ex: `08:00-22:00`)[cite: 3].
- [ ] `business.payments` : modes de paiement acceptés (`cash`, `transfer`, `card`)[cite: 3].
- [ ] `fleet.cars` : liste complète des véhicules, prix journaliers réels, nombre de places et type de boîte/carburant[cite: 3].

### D. Avis Clients (`reviews`)
- [ ] Ajouter les avis réels du client avec langues respectives (`fr`, `ar`, `en`), ou laisser `items: []` pour masquer le composant[cite: 3].

---

## 3. Préparation des Images (`public/`)
- [ ] `public/logo.png` : logo officiel de l'agence[cite: 3].
- [ ] Placer `hero.jpg` dans `public/` et lancer `npm run images` pour générer `hero.webp` et `og-hero.jpg`[cite: 3].
- [ ] Placer les photos des voitures dans `public/fleet/` (format `.jpg` ou `.png`) et lancer `npm run images` pour créer les `.webp`[cite: 3].
- [ ] Si `HAS_AIRPORT = true` : placer `meeting-point.jpg` dans `public/` puis exécuter `npm run images`[cite: 3].

---

## 4. Levée du Build Guard (Production Readiness)
Une fois toutes les étapes ci-dessus vérifiées minutieusement :
- [ ] `verified.businessInfo = true`[cite: 3]
- [ ] `verified.legalClaims = true`[cite: 3]
- [ ] `verified.fleet = true`[cite: 3]
- [ ] `verified.seo = true`[cite: 3]

---

## 5. Audit & Déploiement Cloudflare Pages
- [ ] Lancer la vérification TypeScript et Lint : `npm run lint`[cite: 3].
- [ ] Compiler la version finale : `npm run build` (doit réussir sans erreur de guard)[cite: 3].
- [ ] Déployer sur Cloudflare Pages sur la branche de production :
  ```bash
  npx wrangler pages deploy out --project-name=nom-client --branch=main
  ```
- [ ] Vérifier sur le domaine de production (`[https://nom-client.pages.dev](https://nom-client.pages.dev)`) :
  - L'affichage sans flash des langues (FR / AR / EN).
  - L'ouverture du message WhatsApp pré-rempli depuis un téléphone mobile.
  - Le fichier `[https://nom-client.pages.dev/robots.txt](https://nom-client.pages.dev/robots.txt)` (doit autoriser l'indexation en production)[cite: 3].
  - Le fichier `[https://nom-client.pages.dev/sitemap.xml](https://nom-client.pages.dev/sitemap.xml)`[cite: 3].
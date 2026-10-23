# Checklist de Deploiement Client (Next.js Static + Cloudflare Pages)

Ce guide recapitule toutes les etapes necessaires pour configurer et deployer un nouveau client a partir de ce template.

---

## 1. Initialisation du projet client
- [ ] Cliquer sur **Use this template** sur GitHub pour creer le depot du client (ex: nom-agence-site).
- [ ] Cloner le projet en local dans WSL : git clone url-du-repo.
- [ ] Installer les dependances : npm install (ou npm ci).

---

## 2. Configuration Metier (src/data/config.ts)

### A. Statut Aeroport & Localisation
- [ ] CITY_HAS_AIRPORT : true uniquement si la ville possede son propre aeroport. Si false (ex: Jadida, Meknes), aucun texte ne dit « Aeroport {ville} » (badge, titre, SEO, pied de page, URL).
- [ ] AIRPORT_SERVICE : true si l'agence propose la livraison / un rendez-vous a l'aeroport.
- [ ] seo.city et seo.cityAr : nom de la ville principale (ex: Agadir / أكادير).
- [ ] seo.region : region administrative (ex: Souss-Massa).
- [ ] seo.areas et seo.areasAr : zones couvertes en respectant la parite exacte (ex: Taghazout, Aourir).
- [ ] Si CITY_HAS_AIRPORT = true : renseigner obligatoirement seo.airport, seo.airportAr, seo.airportCode, seo.meetingPoint, seo.meetingPointAr.
- [ ] Si CITY_HAS_AIRPORT = false et AIRPORT_SERVICE = true : renseigner obligatoirement la liste seo.deliveryAirports avec noms (FR/AR) et codes IATA reels (ex: CMN, RAK, AGA).

### B. Informations de Marque & Contact
- [ ] brand.name + brand.nameLight : separer le nom principal et son extension stylisee.
- [ ] website.url : URL definitive du client avec HTTPS (ex: https://nomagence.ma).
- [ ] website.contentUpdated : date du jour au format YYYY-MM-DD.
- [ ] contact.whatsapp : format international sans + (ex: 2126XXXXXXXX).
- [ ] contact.phone : format international avec + (ex: +2126XXXXXXXX).
- [ ] contact.phoneDisplay : format lisible avec espaces (doit correspondre exactement aux chiffres de phone).
- [ ] contact.address : adresse physique reelle.
- [ ] contact.geo : latitude et longitude GPS reelles (ne pas laisser a 0,0).
- [ ] contact.googleMapsLink : lien Maps HTTPS valide vers l'agence ou le point de rencontre.
- [ ] contact.sameAs : liens vers les reseaux sociaux reels du client (ou tableau vide []).

### C. Regles de Reservation & Flotte
- [ ] booking.withCaution : false pour "Sans caution", true avec caution.
- [ ] booking.advancePaymentDh : montant d'acompte en DH, ou null si aucun acompte.
- [ ] booking.freeCancellation, unlimitedKm, freeAirportDelivery, freeCityDelivery, insuranceIncluded.
- [ ] business.openingHours : format strict HH:MM-HH:MM (ex: 08:00-22:00).
- [ ] business.payments : modes de paiement acceptes (cash, transfer, card).
- [ ] fleet.cars : liste complete des vehicules, prix journaliers reels, nombre de places et type de boite/carburant.

### D. Avis Clients (reviews)
- [ ] Ajouter les avis reels du client avec langues respectives (fr, ar, en), ou laisser items: [] pour masquer le composant.

---

## 3. Preparation des Images (public/)
- [ ] public/logo.png : logo officiel de l'agence.
- [ ] Placer hero.jpg dans public/ et lancer npm run images pour generer hero.webp et og-hero.jpg.
- [ ] Placer les photos des voitures dans public/fleet/ (format .jpg ou .png) et lancer npm run images pour creer les .webp.
- [ ] Si AIRPORT_SERVICE = true : placer meeting-point.jpg dans public/ puis executer npm run images.

---

## 4. Levee du Build Guard (Production Readiness)
Une fois toutes les etapes ci-dessus verifiees minutieusement :
- [ ] verified.businessInfo = true
- [ ] verified.legalClaims = true
- [ ] verified.fleet = true
- [ ] verified.seo = true

---

## 5. Audit & Deploiement Cloudflare Pages
- [ ] Lancer la verification TypeScript et Lint : npm run lint.
- [ ] Compiler la version finale : npm run build (doit reussir sans erreur de guard).
- [ ] Deployer sur Cloudflare Pages sur la branche de production :
  npx wrangler pages deploy out --project-name=nom-client --branch=main
- [ ] Verifier sur le domaine de production :
  - L'affichage sans flash des langues (FR / AR / EN).
  - L'ouverture du message WhatsApp pre-rempli depuis un telephone mobile.
  - Le fichier https://nom-client.pages.dev/robots.txt (doit autoriser l'indexation en production).
  - Le fichier https://nom-client.pages.dev/sitemap.xml.
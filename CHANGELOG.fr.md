# Changelog

## [Unreleased]

### Fonctionnel
- Add: page d'accueil « Starting soon » avec un champ d'étoiles animé (module `starfield`) et un thème visuel spatial.
- Add: favicon (SVG + icône Apple touch), meta description et balises OpenGraph / Twitter card avec une image d'aperçu 1200×630.

### Technique
- Update: migration de Next.js vers un projet HTML + TypeScript simple construit avec Vite.
- Update: nginx sert le build statique sur le port 3000 avec un healthcheck Docker.

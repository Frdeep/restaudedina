---
version: alpha
name: La Cuisine de Dina
description: Charte du site existant à préserver pendant les améliorations ciblées.
colors:
  white: "#ffffff"
  brown: "#48291d"
  black: "#201b18"
  yellow: "#f4cb39"
  line: "#48291d33"
  muted: "#4d3a30"
  control-line: "#8a7468"
typography:
  display:
    fontFamily: Display
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: Outfit
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
---

## Overview

Site de restaurant africain à Compiègne. Préserver la présentation actuelle, ses photos de plats sur blanc et son identité typographique d’affiche lors des améliorations ciblées.

## Colors

Utiliser le blanc pour le fond principal, le cacao et le noir doux pour le texte, le jaune pour les accents. Ne pas réintroduire le bordeaux ou le vert dans les éléments d’interface ; les couleurs naturelles de la nourriture ne définissent pas la palette de l’interface.

## Typography

La famille locale Display correspond au fichier Bowlby One SC et porte les titres d’affiche ; Outfit porte les textes, menus et actions. Conserver l’auto-hébergement des polices. Les règles responsive des composants gouvernent les tailles de titre ; ne pas les remplacer par une taille fixe commune à tous les écrans.

## Layout

Préserver l’ordre et les parcours du site existant hors de la surface demandée. Maintenir une version mobile pensée pour la navigation tactile, l’accès à la carte, l’appel et la commande. Conserver le visuel principal entier et la carte imprimable sur deux faces.

## Components

Conserver des boutons contrastés et des états de focus visibles. Les filtres doivent laisser la carte consultable sans JavaScript. Réutiliser les traitements partagés du site avant d’ajouter une nouvelle variante.

Les lecteurs officiels des réseaux doivent être chargés uniquement après le choix de l’utilisateur, avec des liens de secours et une possibilité de retirer ce choix. Ne pas présenter de fausses publications. Identifier les rendus de plats et le logo adaptés comme des visuels recréés lorsque leur provenance est présentée.

## Do's and Don'ts

- Respecter la préférence de mouvement réduit et garder les actions disponibles sans animation.
- Ne pas déduire une nouvelle charte d’un résultat de recherche de palette.
- Ne pas transformer une amélioration ciblée en refonte générale ou en migration de framework.
- Ne pas inventer d’avis, d’abonnés, de recettes, de services, de prix ou d’informations légales.

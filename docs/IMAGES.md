# Association des photos aux plats

Aucune nouvelle image officielle n'est présente dans les pièces jointes accessibles au début de cette réalisation. Ne pas substituer de photos de stock aux plats de Dina.

À réception, conserver les originaux, inspecter chaque image puis noter : nom du fichier, contenu observé, plat candidat dans data/restaurant.json, indices, degré de confiance et confirmation de Dina. Une photo seule ne permet pas de garantir une sauce, une viande, des allergènes ou le nom précis d'un plat.

## Photos visibles reçues ensuite

Les 12 photos sont visibles dans le message du client. Elles ne sont pas exposées comme fichiers téléchargeables dans les pièces jointes accessibles à l’exécution. Leur intégration binaire reste bloquée jusqu’à réception de fichiers JPG/PNG ou d’une archive ZIP.

Numérotation : ordre des images du message, de haut en bas. Les identifications sont des hypothèses visuelles à confirmer par Dina.

| N° | Observation | Association proposée | Confiance / usage |
|---|---|---|---|
| 1 | Personne devant la devanture Dina | Le restaurant | Forte pour le lieu ; ne pas affirmer l’identité de la personne. Section La maison. |
| 2 | Poisson entier grillé, citron, plantains et sauce | Daurade (`daurade`) | Moyenne : espèce à confirmer. |
| 3 | Salle, sièges bordeaux, décors muraux | La salle | Forte ; section Nous trouver. |
| 4 | Riz blanc, sauce orangée épaisse et viande ; boisson claire | Mafé (`mafe`) | Moyenne : recette à confirmer. Boisson non identifiable avec certitude. |
| 5 | Poulet, riz rouge et légumes en barquette | Thiéb bou guinar (`thieb`) | Forte visuellement. Bon candidat au visuel principal. |
| 6 | Poulet, riz rouge et légumes en assiette | Thiéb bou guinar (`thieb`) | Forte ; ne pas créer un deuxième plat. |
| 7 | Grand plat de poulet, riz blanc, oignons et olives | Yassa (`yassa`) | Forte ; ne pas déduire une prestation traiteur du format. |
| 8 | Poulet, oignons et riz blanc en barquette ; boisson sombre | Yassa (`yassa`) | Forte pour le plat ; bissap possible mais à confirmer. |
| 9 | Brochettes de viande, frites, salade et oignons | Brochettes de bœuf ou poulet | Faible sur l’espèce : confirmation nécessaire avant attribution. |
| 10 | Poulet grillé, frites et sauce ; autocollant | Grillades de poulet (`demi-poulet` candidat) | Moyenne sur le type, faible sur la portion. Préférer un original sans autocollant. |
| 11 | Chaussons frits ouverts, farce de viande apparente | Fatayas (`fatayas` candidat) | Moyenne : distinguer des pastels avec Dina. Préserver la signature du photographe. |
| 12 | Riz blanc et sauce orangée séparés | Mafé (`mafe` candidat) | Moyenne : recette à confirmer. |

À réception des fichiers, conserver les originaux, créer des variantes WebP responsive et lier chaque fichier à l’identifiant existant du plat. Aucune photo n’atteste d’allergènes, de garanties halal, d’une portion commerciale ou de la composition exacte d’une sauce.

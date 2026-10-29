# Panier et future commande réelle

## Ce qui fonctionne maintenant

Le catalogue est dérivé de `data/restaurant.json` par `scripts/catalog.mjs`. Les 32 fiches et `panier.html` sont rendus côté serveur et exportés statiquement. Les prix client sont en centimes, avec formatage EUR/fr-FR.

`public/cart-core.js` est partagé par le navigateur et les tests : il valide les références, quantités entières, choix autorisés, formats et expiration. Il ignore les prix fournis dans le stockage et utilise ceux du catalogue courant. Le panier se conserve 30 jours sans mise à jour, ne contient aucune donnée personnelle et se vide ou se restaure depuis les contrôles de l’interface. Une suppression peut être annulée.

Le bouton de validation est explicitement une **simulation**. Il n’effectue aucune requête de commande et ne vide pas le panier en laissant croire que le restaurant l’a reçu. Aucun endpoint de paiement, donnée de carte, adresse, téléphone client ou confirmation commerciale n’est créé.

## Ce que le stockage client ne garantit pas

Le client peut modifier son navigateur et son catalogue. Aucune validation front-end ne constitue une protection de prix, de stock, de paiement ou d’ordre en production. Ne pas connecter simplement un bouton à un prestataire et considérer le système sécurisé.

## Avant l’ouverture des commandes

1. Confirmer l’exploitant et compléter `data/legal.json`, les prix TTC, allergènes, portions, disponibilités et conditions de livraison/retrait/annulation.
2. Ajouter un endpoint serveur de devis recevant seulement les identifiants, quantités et options. Recalculer les prix depuis la source serveur, vérifier les choix, l’ouverture, les stocks, la zone et les frais. Produire un devis daté et identifié, sans faire confiance au total du navigateur.
3. Définir le stockage et la réception des commandes par le restaurant, leurs états, les délais, la confidentialité, les durées de conservation et les communications au client.
4. Choisir le prestataire de paiement, créer les sessions côté serveur, protéger les secrets dans l’environnement et vérifier les signatures des webhooks. Traiter l’idempotence et les événements répétés ; ne jamais confirmer un paiement depuis une simple URL de retour.
5. Confirmer la commande sur support durable après acceptation réelle, gérer les annulations/remboursements selon les règles validées et la médiation de consommation compétente.
6. Tester les interruptions, échecs, doublons, ruptures de stock, délais, frais et retours de paiement avant d’activer la vente.

Les liens vers Uber Eats restent disponibles pour les commandes réelles, sous les conditions propres à la plateforme.

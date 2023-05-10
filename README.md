
# SaveIT

## Introduction

SaveIT est un jeu vidéo 3D pour navigateur qui vise à sensibiliser à l'importance du tri des déchets et de la durabilité. Le joueur contrôle un personnage qui doit collecter et trier autant de déchets que possible tout en évitant les obstacles.

## Comment jouer

Au démarrage du jeu, vous êtes présenté avec un écran de menu principal. Ici, vous pouvez choisir la qualité graphique du jeu (Low,Medium,High   ) avant de commencer à jouer. 
- **Low Graphics** : Ce mode permet de jouer de manière fluide sans aucun lag. Aucun arbre n'est affiché et les obstacles sont en 2D, ce qui rend le jeu moins esthétiquement plaisant.

- **Medium Graphics (par défaut)** : Ce mode permet d'afficher un nombre correct d'arbres avec des performances équilibrées. Les obstacles sont en 2D.

- **High Graphics** : Ce mode permet d'afficher plus d'arbres et des obstacles en 3D, ce qui rend le jeu plus beau visuellement. Cependant, ce mode peut engendrer des lags et doit encore être optimisé.
Une fois que vous avez sélectionné votre choix et cliqué sur "Start", le jeu commence.

Pour commencer la partie il faut cliquer sur la touche *Espace*.

Votre personnage se trouve sur une route continue. Votre objectif est de collecter autant de déchets que possible et de les trier correctement. Vous pouvez déplacer votre personnage à gauche et à droite avec les touches fléchées de votre clavier.

Pendant que vous jouez, le jeu augmente progressivement sa vitesse, ce qui ajoute de la difficulté et rend le jeu plus intéressant

Vous pouvez mettre le jeu en pause à tout moment en appuyant sur la touche "P" de votre clavier. Cela ouvre un menu de pause où vous pouvez choisir de reprendre le jeu, de redémarrer ou de quitter le jeu.

## Fonctionnalités techniques

Le jeu utilise Babylon.js, une puissante bibliothèque JavaScript pour la création de jeux 3D dans le navigateur. Il utilise également les modules ES6 pour organiser le code en modules réutilisables, ce qui facilite la maintenance et l'extension du code.

Le fichier `main.js` est le point d'entrée du jeu et contient la logique principale du jeu. Il initialise le jeu, crée la scène et les objets du jeu, gère les entrées du joueur et contrôle la boucle de rendu du jeu.

Le jeu utilise un système de modules pour générer le terrain et les objets du jeu. Les modules sont des fichiers JSON qui contiennent des informations sur la géométrie du terrain et l'emplacement des objets. Ces modules sont chargés dynamiquement pendant que vous jouez, ce qui permet au jeu de continuer indéfiniment.

## Bugs connus

1.  Le jeu peut ralentir sur certains appareils avec des performances limitées.


## Fonctionnalités et améliorations prévues

1. Changer les model 3D
2. Ajout d'une bande son
3. Ajout d'autres animations
4.  Ajout de plus de types de déchets à collecter et à trier.
5.  Optimisation du code pour améliorer les performances du jeu sur tous les appareils.
6.  Ajout de plus de modules de niveau pour plus de variété.
7.  Ajout d'un système de score pour rendre le jeu plus compétitif.
8. Ajout d'un nouveau décor


# SaveIT

## Introduction

SaveIT est un jeu vidéo 3D pour navigateur qui vise à sensibiliser à l'importance du tri des déchets et de la durabilité. Le joueur contrôle un personnage qui doit collecter et trier autant de déchets que possible tout en évitant les obstacles.

## Comment jouer

Au démarrage du jeu, vous êtes présenté avec un écran de menu principal. Ici, vous pouvez choisir la qualité graphique du jeu (Low,Medium,High   ) avant de commencer à jouer. 

- **Low Graphics** : Ce mode permet de jouer de manière fluide sans aucun lag. Aucun arbre n'est affiché et les obstacles sont en 2D, ce qui rend le jeu moins esthétiquement plaisant.
![image](https://github.com/AyoubAdm/SaveIt/assets/64748357/b5a6c6dd-9c25-464d-9dd4-55ab8f93d2df)



- **Medium Graphics (par défaut)** : Ce mode permet d'afficher un nombre correct d'arbres avec des performances équilibrées. Les obstacles sont en 2D.

![image](https://github.com/AyoubAdm/SaveIt/assets/64748357/f9a0256f-0fb0-4cfd-bc26-0cea106498de)



- **High Graphics** : Ce mode permet d'afficher plus d'arbres et des obstacles en 3D, ce qui rend le jeu plus beau visuellement. Cependant, ce mode peut engendrer des lags et doit encore être optimisé.

![image](https://github.com/AyoubAdm/SaveIt/assets/64748357/afb52bbb-0364-41c5-938c-b70ba416503a)


Une fois que vous avez sélectionné votre choix et cliqué sur "Play", choissisez votre mode de jeu et le jeu commence.

Une fois la partie lancée, pour  commencer à courir,  il faut cliquer sur la touche *Espace*.

Votre personnage se trouve sur une route continue. Votre objectif est de collecter autant de déchets que possible et de les trier correctement. Vous pouvez déplacer votre personnage à gauche et à droite avec les touches fléchées de votre clavier.

Pendant que vous jouez, le jeu augmente progressivement sa vitesse, ce qui ajoute de la difficulté et rend le jeu plus intéressant

Vous pouvez mettre le jeu en pause à tout moment en appuyant sur la touche "P" de votre clavier. Cela ouvre un menu de pause où vous pouvez choisir de reprendre le jeu, de redémarrer ou de quitter le jeu.

## Les modes de jeu
SaveIT propose deux modes de jeu distincts pour offrir une expérience de jeu flexible et adaptée à différents types de joueurs : le mode "Endless" et le mode "Levels".

**Mode Endless**
Dans le mode "Endless", le jeu est généré de manière procédurale et continue à mesure que le joueur progresse. Le terrain et les objets sont générés à la volée, ce qui signifie qu'il n'y a pas de fin définie pour le jeu - vous pouvez continuer à jouer et à accumuler des points aussi longtemps que vous le pouvez. Ce mode de jeu est parfait pour ceux qui cherchent à battre leur propre score et à tester leurs compétences de tri des déchets à leur limite. La difficulté dans ce mode augmente progressivement avec le temps, offrant un défi constant aux joueurs.

**Mode Levels**
Le mode "Levels", en revanche, propose trois niveaux de jeu distincts : Facile, Moyen et Difficile. Chaque niveau est pré-défini et se compose de différentes configurations d'objets et de déchets, créées à partir de fichiers JSON. Ce mode de jeu est idéal pour ceux qui préfèrent une expérience de jeu plus structurée avec des objectifs définis. Les joueurs peuvent choisir le niveau de difficulté qui correspond à leurs compétences et tenter de compléter chaque niveau avec le meilleur score possible.

En bref, que vous soyez un joueur occasionnel qui veut simplement passer un bon moment en jouant à un jeu amusant et éducatif, ou un joueur sérieux qui veut relever des défis et améliorer constamment ses compétences, SaveIT a un mode de jeu qui vous convient.

## Fonctionnalités techniques

Le jeu utilise Babylon.js, une puissante bibliothèque JavaScript pour la création de jeux 3D dans le navigateur. Il utilise également les modules ES6 pour organiser le code en modules réutilisables, ce qui facilite la maintenance et l'extension du code.

Le fichier `main.js` est le point d'entrée du jeu et contient la logique principale du jeu. Il initialise le jeu, crée la scène et les objets du jeu, gère les entrées du joueur et contrôle la boucle de rendu du jeu.

Le jeu utilise un système de modules pour générer le terrain et les objets du jeu. Les modules sont des fichiers JSON qui contiennent des informations sur la géométrie du terrain et l'emplacement des objets. Ces modules sont chargés dynamiquement pendant que vous jouez, ce qui permet au jeu de continuer indéfiniment. Le joueur ne se déplace pas, en réalité c’est tout le terrain qui vient vers le joueurs (technique du défilement)

## Création de niveau
La création de nouveaux niveaux dans SaveIT est facile et flexible grâce à l'utilisation de fichiers JSON. Chaque niveau est défini par un fichier JSON, qui spécifie les emplacements des déchets (wasteSpawns) et des poubelles (binSpawns).
Il suffit donc de créer un nouveau fichier JSON et de définir les emplacements des déchets et des poubelles pour créer un nouveau niveau. L'outil de génération de niveau peut être utilisé pour générer ces fichiers JSON de manière plus facile et automatisée.

Ensuite, le fichier JSON est chargé par le jeu, qui utilise ces informations pour placer les déchets et les poubelles dans le monde du jeu.

Cela rend la création de niveaux dans SaveIT une tâche simple et accessible même à ceux qui ne sont pas familiers avec la programmation ou le développement de jeux.

## Bugs majeurs connus
Appuyer sur la touche d’espace alors que le jeu est en pause fera courir le personnage.
En mode “High graphics”, la page chargement se termine alors que les models 3D des obstacles n’ont pas finis de charger
Au tout début de la course en mode endless, les 2-3 premiers obstacles apparaissent d’un coup
Relancer une partie via le bouton pause puis re appuyer sur pause durant cette nouvelle partie affichera 2 menu pause superposés l'un sur l'autre.

## Evolution du jeu
Au début, nous nous sommes concentré sur la création de plateforme et d'obstacle à la volée. Notre jeu n'était alors fais que de simples cubes : 
![image](https://github.com/AyoubAdm/SaveIt/assets/64748357/ec4a78c2-0924-48ce-ab51-86a765f7c527)

Puis nous avons ajouté une skybox ainsi que des cubes rouges sur le cotés de la plateforme (pour ensuite les remplacer par des arbres) : 
![image](https://github.com/AyoubAdm/SaveIt/assets/64748357/51bc7169-d456-4630-9910-8933f76ad2a2)

Enfin voici le rendu final du jeu avec un évolution du décor : 
![image](https://i.ibb.co/GWndg4f/Sans-titre3.png)
![image](https://i.ibb.co/RvhYcBN/Sans-titre1.png)
![image](https://i.ibb.co/jG5WLDG/Sans-titre2.png)

## Demo vidéo

Une démo vidéo du jeu est disponible ici : [https://youtu.be/x-UbBz5Dlf4](https://youtu.be/9ecRV4X5AbA)

### Tester le jeu

Le jeu est testable en ligne : https://www.minuteanime.com/play/SaveIt/  **Attention, le jeu peux mettre un certain temps à charger soyez patient :)**

Ou en local, clonez ce repo et lancer index.html en live server

Amusez vous !


### Auteurs
Les auteurs sont un groupe de 3 étudiants en M1 MIAGE à l’université Côte d’Azur.


AARJI Yahya 
ADMESSIEV Ayoub
SAHLI Moutez


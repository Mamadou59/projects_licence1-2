============================
Jounal du projet Labyrinthe
============================

.. topic: Réalisé par
	
	* DIALLO Mamadou
	* COULIBALY Ivette
	* SAIDI Mahrez

Semaine du 15 au 21 novembre
============================

Objectifs
---------

* La class Cell

	* Construction
	* Différents selecteurs et modificateurs

* La class Maze

	* Construction
	* Mise en oeuvre d'une structure de données permettant de représenter un labyrinthe
	* Différents selecteurs et modificateurs
	

Bilan
-----

* La class Cell

Etant donnée q'une cellule dans un labyrithe contient quatres murs dont on pourrait casser selon la position de la cellule
dans la grille et pour représenter l'état d'une cellule on a utilisé quatres options (Nord,Sud,Est,Ouest) dont les valeurs sont respectivement (1,2,4,8) vous remarquerez au passage que c'est sont des puissances de 2 et on peut coder facilement toutes les 16 combinaisons possibles et les garder dans une variable dont la valeur par defaut est 0; en plus de ces états une cellule peut être revelée ou non donc un selecteur is_revealed() et un modificateur reveal() ont été faites pour ça.

* La class Maze

Une construction de la grille est faite avec un dicionnaire de (width X height) cellules (de la class Cell) et les clés de ce dictionnaire sont les coordonnées de chaque cellule. Une fonction neighborhood est mise en place pour donner les voisins d'une cellule dont les coordonnées lui sont passées en paramètre, une liste de triplet qui est retournée dont les deux premiers éléments du triplet représentent les coordonnées et le troisième la position du voisin par rapport à la cellule, aussi des selecteurs comme get_width(), get_height(), get_cell(), get_all_cells(), un modificateur break_walls() (qui casse le mur de deux cellules adjacentes, les cellules et la position de la deuxième cellule par rapport à la première lui sont passées en paramètre) et une fonction cell_alea_and_neighborhood() qui retourne une cellule aleatoire et une liste de ses voisins.

Semaine du 22 au 28 novembre
============================

Objectifs
---------

* Construction des labyrinthes parfaits aléatoires de dimension données.
* Une représentation externe d'un labyrinthe au format texte.
* Trouver, s’il en existe, un chemin d’un point du labyrinthe à un autre.

Bilan
-----

* Construction des labyrinthes parfaits aléatoires de dimension données:

La fonction chemin assure cette tâche, qui fonctionne de cette façon elle revèle toute cellule adjacente d'une cellule donnée aleatoirement tout en cassant le mur que partagent les deux cellules jusqu'à ce que toutes les cellules soient revélées et toutes fois qu'elle se retrouve avec une cellule dont toutes les cellules adjacentes sont revélées une pile est utilisée dans la quelle on empile toutes les cellules revélées donc il faudra dans ce cas dépiler la cellule au sommet et voir si l'un de ses voisins n'est pas revélé pour refaire la même chose sur ce voisin.

NB: La fonction marche pour des labyrinthe dont width < 22 et height < 22 sinon elle retourne un maximum recurssion, on obtient toujours des labyrinthe parfaits.

* Une représentation externe d'un labyrinthe au format texte:

Avec la fonction privée str on obtient une représentation d'un labyrinthe en chaine de caractères.
Et une fonction (aff) est écrite qui ouvre un canal vers le dossier "Mazes" et crée un fichier (.txt) dans le quel est recopiée la chaine retournée par la fonction privée str.

* Trouver, s’il en existe, un chemin d’un point du labyrinthe à un autre:
 
La fonction chemin_point_a_autre qui prend en paramètres les coordonnées de la cellule de depart, voit parmis ses voisins lesquels ont un mur cassé parmis lesquels on choisit aléatoirement un voisins sur lequel on refait la même chose, toute fois qu'on se retouve avec une cellule qui n'a q'une seule issue une pile est utilisée dans la quelle on empile toutes les cellules qui possedent au moins deux issues alors il faudra depiler l'élément au sommet et refaire la même chose; et une fois qu'on atteint les coordonnées de la cellule d'arrivée ça veut dire qu'il y'a un chemin mais si toute fois la pile est vide dans ce cas il n'y a pas de chemin.

NB: Malheureusement la fonction est coûteuse. 

Semaine du 29 au 05 decembre
============================

Objectifs
---------

* Tâcher d'optimiser la fonction "chemin_point_a_autre".
* Si possible commencer l'interface graphique.

Bilan
-----

Des choses qui ont changées: Pour optimiser la creation de chemins dans un labyrinthe on a utiliser une boucle while au lieu de la recursivité un attribut qui est ajouté dans la class (Cell) dont les valeurs sont uniquement 0 et 1 selon que la cellule fait partie du chemin lors de la recherche du chemin entre deux points donnés et aussi les noms de certaines fonctions.

Pour l'optimisation de la fonction "chemin_point_a_autre" on a aussi une boucle et une pile dans la quelle on stocke tous les chemins jusqu'à ce le point d'arrivé soit atteint (elle retourne la liste de toutes les cellules qui font parties du chemins) et ces cellules sont isolées à partir de l'attibut ci-dessus.

Semaine du 06 au 12 decembre
============================

Objectifs
---------

* Dessiner le chemin de deux points donnés dans le labyrinthe (mode textuel).
* Preparation de la presentation du projet.

Bilan
-----

Tous les objetifs ont été atteint et on a aussi dévélopper l'interface graphique pour avoir le même affichage que le mode textuel dans lequel un boutton "chemin" fera apparaitre le chemin recherché lors du clic sur ce dernier.


MODE D’EMPLOI
-------------

Dans un interpréteur de commandes :

La commande : main1.py permet de créer un labyrinthe par défaut de taille 5 5.

La commande : main1.py width height crée un labyrinthe de taille width et height.

Pour rechercher un chemin en même temps qu’on crée un labyrinthe il suffit d’ajouter les coordonnées des deux points

La commande : main1.py width height x1 y1 x2 y2 réalise cette tâche.

Et pour utiliser l’interface graphique il suffit juste dans toutes les commandes remplacer main1.py par main2.py.

Conclusion  
-----------
Ce projet nous a permis d'effectuer une reflexion profonde sur un projet en groupe, d'en discuter ensemble pour enfin retrouver une solution fiable et aussi d'approfondir nos connaissances sur les notions abordées en cours: la programmation modulaire, structures des piles...  

Merci M. Eric Wegrzynowski c'était un agréable plaisir de vous rencontrer sur notre parcours.

Bonne fete de fin d'année.


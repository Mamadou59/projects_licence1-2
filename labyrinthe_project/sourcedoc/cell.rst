=====================
 ``cell`` module
=====================

:doc:`back <index>`

Ce module définit une classe pour représenter les cellules (ou cases) de jeu de labyrinthe.

* prend une cellule et renvoie un dictionnaire contenant les quatres directions ainsi que leur valeur
* prend une cellule et renvoie  sa situation
* casse un mur de la cellule 
* dit si une cellle est revelée ou pas
* et revele une cellule

La classe :class:`Cell`
------------------------------   

.. autoclass:: cell.Cell
				    
Selectors
---------

.. automethod:: cell.Cell.get_direction

.. automethod:: cell.Cell.get_direction_situation

.. automethod:: cell.Cell.get_c

Predicate
---------

.. automethod:: cell.Cell.is_visited

Modificators
------------

.. automethod:: cell.Cell.break_wall

.. automethod:: cell.Cell.change_c
		  
.. automethod:: cell.Cell.visit

.. automethod:: cell.Cell.unvisit

Private methods
---------------
.. automethod:: cell.Cell.__init__


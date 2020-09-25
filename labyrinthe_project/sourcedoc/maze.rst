----------------------
 ``maze`` module
----------------------

:doc:`back <index>`


Ce module définit des classes et fonctions auxiliaires pour gérer le jeu de labyrinthe.

La classe :class:`maze`
------------------------------   

.. autoclass:: maze.Maze
				
Methods
-------

Selectors
---------

.. automethod:: maze.Maze.get_width

.. automethod:: maze.Maze.get_height

.. automethod:: maze.Maze.get_cell

.. automethod:: maze.Maze.get_all_cells

.. automethod:: maze.Maze.get_stack

.. automethod:: maze.Maze.return_cell_alea

Modificators
------------

.. automethod:: maze.Maze.break_walls

.. automethod:: maze.Maze.paths

.. automethod:: maze.Maze.list_lines

.. automethod:: maze.Maze.make_maze_file

.. automethod:: maze.Maze.make_neighborhood_unvisit

.. automethod:: maze.Maze.point_to_point_path

Predicate
---------

.. automethod:: maze.Maze.all_cell_are_visited
								
Private methods
---------------
.. automethod:: maze.Maze.__init__

.. automethod:: maze.Maze.__str__

Auxiliary function
------------------

.. autofunction:: maze.neighborhood

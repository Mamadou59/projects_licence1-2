#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
:mod:`maze` module

:author: DIALLO Mamadou COULIBALY Ivette and SAIDI Mahrez

:date: 20 novembre 2018

This module provides functions and a class for maze's game's management.

"""

from cell import*
from stack import*
import random

def neighborhood(x, y, width, height):
    """
    :param x: x-coordinate of a cell
    :type x: int
    :param y: y-coordinate of a cell
    :type y: int
    :param height: height of the grid
    :type height: int
    :param width: width of the grid
    :type width: int
    :return: the list of coordinates with the direction of the cell compared to that passed in param
             of the neighbors of position (x,y) in a
             grid of size width*height
    :rtype: list of tuple
    :UC: 0 <= x < width and 0 <= y < height
    :Examples:
    >>> neighborhood(0,0,5,5)
    [(1, 0, 'S'), (0, 1, 'E')]
    >>> neighborhood(0,3,5,5)
    [(1, 3, 'S'), (0, 4, 'E'), (0, 2, 'O')]
    >>> neighborhood(2,2,5,5)
    [(1, 2, 'N'), (3, 2, 'S'), (2, 3, 'E'), (2, 1, 'O')]
    """
    l = []
    pos = [(-1,0,"N"),(1,0,"S"),(0,1,"E"),(0,-1,"O")]
    for i in range(4):
        if 0 <= x + pos[i][0] < height and 0 <= y + pos[i][1] < width:
            l.append((x+pos[i][0],y+pos[i][1],pos[i][2]))
    return l

class MazeError(Exception):
    """
    Exception used by methods

    * ``__init__``
    * ``point_to_point_path``
    
    of class :class:`Maze`.
    """
    
    def __init__(self, msg):
        self.message = msg
class Maze():
    
    def __init__(self,width = 5,height = 5):
        """
        build a Maze grid of size width*height cells
        
        :param width: [optional] horizontal size of game (default = 5)
        :type width: int
        :param height: [optional] vertical size of game (default = 5)
        :type height: int
        :UC: width and height must be positive integers
        :Examples:
        >>> M = Maze()
        >>> type(M)
        <class '__main__.Maze'>
        """
        if (width < 2 or height < 2):
            raise MazeError("I can not build a maze with these dimensions try bigger dimensions")
        self.__width = width
        self.__height = height
        self.__all_cells = {(i,j):Cell() for i in range(height) for j in range(width)}
        self.__paths = []
        self.__stack = Stack()
        
    def get_width(self):
        """
        Return height of the grid in self
        
        :rtype: int
        :UC: none
        :Examples:
        >>> M = Maze(20,20)
        >>> M.get_width()
        20
        """
        return self.__width
    
    def get_height(self):
        """
        :return: width of the grid in game
        
        :rtype: int
        :UC: none
        :Examples:
        >>> M = Maze(20,20)
        >>> M.get_height()
        20
        """
        return self.__height
    
    def get_cell(self, x, y):
        """
        
        :param x: x-coordinate of a cell
        :type x: int
        :param y: y-coordinate of a cell
        :type y: int
        :return: the cell of coordinates (x,y) in the game's grid
        :rtype: cell
        :UC: 0 <= x < width of game and O <= y < height of game
        :Examples:
        >>> M = Maze()
        >>> c = M.get_cell(1,2)
        >>> type(c)
        <class 'cell.Cell'>
        """
        return self.__all_cells[(x,y)]
    
    def get_all_cells(self):
        """
        :return: the dictionary containing all the cells in the grid
        :rtype: dict
        :UC: none
        :Examples:
        >>> M = Maze()
        >>> cells = M.get_all_cells()
        >>> len(cells) == M.get_width() * M.get_height()
        True
        """
        return self.__all_cells
    
    def break_walls(self,cell,cell_al,dir):
        """
        breaks the wall that shares two cells passed to it in param
        
        :return: none
        :param cell:
        :type cell: Cell
        :param cell_al:
        :type cell_al: Cell
        :param dir: the param cell direction
        :type dir: (str)
        :rtype: None
        :UC: cell and cell_al are all type (Cell) and dir in ["N","S","E","O"]
        """
        if dir == "N":
            cell.break_wall("N")
            cell_al.break_wall("S")
        elif dir == "S":
            cell.break_wall("S")
            cell_al.break_wall("N")
        elif dir == "E":
            cell.break_wall("E")
            cell_al.break_wall("O")
        else: #dir == "O":
            cell.break_wall("O")
            cell_al.break_wall("E")
            
    def return_cell_alea(self):
        """
        :return: a random cell
        :rtype: (tuple)
        :UC: none
        :Examples:
        >>> M = Maze(20,20)
        >>> coord = M.return_cell_alea()
        >>> coord in M.get_all_cells().keys()
        True
        """
        all_cells = self.get_all_cells()
        all_cells_keys = list(all_cells.keys())
        cell_alea = random.choice(all_cells_keys)
        return cell_alea
    
    def get_stack(self):
        """
        :return: the attribute containing the used stack
        :rtype: stack
        :UC: None
        :Examples:
        >>> M = Maze()
        >>> M.get_stack().is_empty()
        True
        """
        return self.__stack

    def all_cell_are_visited(self):
        """
        Return True if all cells are visited False otherways
        
        :rtype: bool
        :UC: None
        :Examples:
        >>> m = Maze()
        >>> m.all_cell_are_visited()
        False
        """
        all_cells = self.get_all_cells()
        for i in all_cells:
            if not all_cells[i].is_visited():
                return False
        return True
        
    def paths(self):
        """
        starts on a random cell and breaks walls until all cells are revealed
        to create perfect paths from every point of the maze to another.
        
        :rtype: None
        :UC: None
        """
        if not self.all_cell_are_visited():
            all_cells = self.get_all_cells()
            cel = self.return_cell_alea()
            all_cells[cel].visit()
            self.get_stack().push(cel)
            nbr_cell_vis = 1 #to count the number of cells visited
            while nbr_cell_vis != self.get_width()*self.get_height():
                l_neighborhood = neighborhood(cel[0],cel[1],self.get_width(),self.get_height())
                l_n = []
                for k in l_neighborhood:
                    cell_voi = all_cells[(k[0],k[1])]
                    if not cell_voi.is_visited():
                        l_n.append(k)
                l_neighborhood = l_n
                if len(l_neighborhood) != 0:
                    c = random.choice(l_neighborhood)
                    cell,cell_al = all_cells[cel[0],cel[1]],all_cells[c[0],c[1]]
                    cell_al.visit()
                    nbr_cell_vis += 1
                    self.get_stack().push(c)
                    self.break_walls(cell,cell_al,c[2])
                    cel = c
                else:
                    cel = self.get_stack().pop()
        
    def list_lines(self):
        """
        :return: a list containing all the lines of a labyrinth whose dmenssions are passed in parameter.
        :rtype: list
        :UC: None
        :Examples:
        >>> M = Maze(7,9)
        >>> t = len(M.list_lines())
        >>> t
        18
        >>> t == 2*M.get_height()
        True
        """
        w = self.get_width()
        h = self.get_height()
        line1 = ["|"]
        line2 = ["+"]
        l = [] 
        all_cells = self.get_all_cells()
        for n in range(h):
            for j in range(w):
                cell = all_cells[n,j]
                situ = cell.get_direction_situation()
                c = cell.get_c()
                if situ & 2 == 2 or situ & 4 == 4: #if the wall south or east of the cell is broken
                    if situ & 2 == 2: #if it's the south wall that's broken
                        line2.append(" +")
                    else:
                        line2.append("-+")
                    if situ & 4 == 4: #if it's the east wall that's broken
                        if c == 1: #if the cell is starting from a path when searching for a path between two points
                            line1.append("* ")
                        else:
                            line1.append("  ")
                    else:
                        if c == 1:
                            line1.append("*|")
                        else:
                            line1.append(" |")
                else:
                    if c == 1:
                        line1.append("*|")
                    else:
                        line1.append(" |")
                    line2.append("-+")
            l.append(line1)
            l.append(line2)
            line1,line2 = ["|"],["+"]
        return l
    
    def __str__(self):
        """
        allows to represent a labyrinth in string.
        
        :return: a string that is the representation of all the lines of a maze
        :rtype: string
        :UC: None
        :Examples:
        >>> M = Maze()
        >>> lab = str(M)
        >>> int(lab[0]) == M.get_width()
        True
        >>> int(lab[2]) == M.get_height()
        True
        """
        w = self.get_width()
        h = self.get_height()
        l = self.list_lines()
        s = ""
        s += "{}\n{}\n".format(w,h)
        s += ("{}".format("+-"* w))
        s += "+\n"
        for line in l:
            for car in line:
                s += ("{}".format(car))
            s += "\n"
        return s
    
    def make_maze_file(self,outfilename):
        """
        Open a channel and copy the string returned by the function __str__.
        
        :rtype: None
        :UC: None
        """
        w = self.get_width()
        h = self.get_height()
        #stream = open("../Mazes/maze_"+str(w)+"_"+str(h)+".txt","w")
        stream = open("../Mazes/"+outfilename+".txt",'w')
        stream.write(str(self))
        stream.close()
        
    def make_neighborhood_unvisit(self,coord):
        """
        Return all coord neighboord unvited and share a broken wall with the cell coord.
        
        :param coord: the coordinates of the cell whose unvisited neighbors are to be recovered
        :type coord: tuple
        :rtype: list
        """
        l_neighborhood = neighborhood(coord[0],coord[1],self.get_width(),self.get_height())
        cel_dep = self.get_cell(coord[0],coord[1])
        situ = cel_dep.get_direction_situation()
        dir = cel_dep.get_direction()
        l_n = []
        for c in l_neighborhood:
            cel_c = self.get_cell(c[0],c[1])
            if situ & dir[c[2]] != 0 and not cel_c.is_visited(): #if the neighboring cell shares a broken wall with the cell and it is not visited
                l_n.append(c)
        return l_n
    
    def point_to_point_path(self,coord_dep,coord_arv):
        """
        check if there is a path between two points whose coordinates are passed in parameters
        and return a list of the cells that are part of the path
        
        :param coord_dep: the coordinates of the starting cell
        :type coord: tuple
        :param coord_arv: the coordinates of the arrival cell
        :type coord: tuple
        :rtype: list
        """
        w,h = self.get_width(),self.get_height()
        if coord_dep[0] < 0 or coord_dep[0] > (h-1):
            raise MazeError("La coordonnée X du point de depart doit être comprise entre 0 et "+str(h)+" exclu")
        elif coord_dep[1] < 0 or coord_dep[1] >  (w-1):
            raise MazeError("La coordonnée Y du point de depart doit être comprise entre 0 et "+str(w)+" exclu")
        elif coord_arv[0] < 0 or coord_arv[0] > (h-1):
            raise MazeError("La coordonnée X du point d'arrivé doit être comprise entre 0 et "+str(h)+" exclu")
        elif coord_arv[1] < 0 or coord_arv[1] > (w-1):
            raise MazeError("La coordonnée Y du point d'arrivé doit être comprise entre 0 et "+str(w)+" exclu")
        p = Stack()
        all_cells = self.get_all_cells()
        for i in all_cells: #To restor all cells to the unvisited state (the initial state) befor searching
            all_cells[i].unvisit()
            if all_cells[i].get_c() == 1:
                all_cells[i].change_c()
        while (coord_dep[0],coord_dep[1]) != coord_arv:
            l_neighborhood = self.make_neighborhood_unvisit(coord_dep)
            cel_dep = self.get_cell(coord_dep[0],coord_dep[1])
            if len(l_neighborhood) >= 1:
                cel_dep.visit()
                cel_dep.change_c()
                p.push(coord_dep)
                coord_dep = random.choice(l_neighborhood)
            else:
                cel_dep.visit()
                if p.is_empty():
                    for i in all_cells: #To restore cells to the initial state after searching 
                        all_cells[i].visit()
                        if all_cells[i].get_c() == 1:
                            all_cells[i].change_c()
                    return False
                coord_dep = p.pop()
                cel_dep = self.get_cell(coord_dep[0],coord_dep[1])
                cel_dep.change_c()
        all_cells[(coord_arv[0],coord_arv[1])].change_c()
        l = []
        for i in all_cells: #Also to restore cells to the initial state after searching
            all_cells[i].visit()

if __name__ == '__main__':
    import doctest
    doctest.testmod(optionflags=doctest.NORMALIZE_WHITESPACE | doctest.ELLIPSIS, verbose=True)
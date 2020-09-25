#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
:mod:`cell` module

:author: DIALLO Mamadou COULIBALY Ivette and SAIDI Mahrez

:date: 13/novembre/2018


"""

class Cell():
    
    def __init__(self):
        
        """

        :return: a new hidden cell of a maze's grid, existence of directions and the position of the broken wall to reach its neighbors.
        :rtype: Cell
        :UC: none
        :Examples:
        >>> c = Cell()
        >>> c.get_direction()
        {'N': 1, 'S': 2, 'E': 4, 'O': 8}
        >>> c.get_direction_situation()
        0
        >>> c.is_visited()
        False
        >>> c.visit()
        >>> c.is_visited()
        True
        >>> c.break_wall("N")
        >>> c.get_direction_situation()
        1
        >>> c.break_wall("S")
        >>> c.get_direction_situation()
        3
        
        """
        
        self.__direction = {"N":1,"S":2,"E":4,"O":8}
        self.__direction_situ = 0
        self.__visited = False
        self.__c = 0 #un attribut dont les valeurs sont 0 ou 1 utilisé que dans la recherche de chemin pour marquer toutes les cellules qui feront partie du chemin
        
    def get_direction(self):
        
        """

        :return: a dictionary containing the qutres side of each cell
        :rtype: dict
        :UC: None
        :Examples:
        >>> c = Cell()
        >>> c.get_direction()
        {'N': 1, 'S': 2, 'E': 4, 'O': 8}
        
        """
        
        return self.__direction
    
    def get_direction_situation(self):
        
        """
        Returns the state of the directions of each cell
        :rtype: int
        
        """
        return self.__direction_situ
    
    def get_c(self):
        
        """

        Return attribut self._c
        
        :rtype: int
        :Example:
        >>> cel = Cell()
        >>> cel.get_c()
        0
        """
        
        return self.__c
    
    def change_c(self):
        
        """

        change attribut sel.__c value to 0 if the value is 1 and 1 if it is 0.
        
        :rtype: None
        :Example:
        >>> cel = Cell()
        >>> cel.get_c()
        0
        >>> cel.change_c()
        >>> cel.get_c()
        1
        
        """
        
        self.__c =  self.__c^1
        
    def break_wall(self,dir):
        
        """

        Break the wall of a direction that passed him as a param
        :rtype: none
        
        """
        directions = self.get_direction()
        situ = self.get_direction_situation()
        direc = situ | directions[dir]
        self.__direction_situ = direc
        
    def is_visited(self):
        
        """
        Return True if self is revealed, False otherwise
        
        :rtype: bool
        :UC: none
        :Example:
        >>> cel = Cell()
        >>> cel.is_visited()
        False
        >>> cel.visit()
        >>> cel.is_visited()
        True
        
        """
        
        return self.__visited
    
    def visit(self):
        
        """
        side effect modify visit state of self
        
        :rtype: None
        :UC: none
        :Example:
        >>> cel = Cell()
        >>> cel.is_visited()
        False
        >>> cel.visit()
        >>> cel.is_visited()
        True
        
        """
        
        self.__visited = True
        
    def unvisit(self):
        
        """

        side effect modify unvisit state of self
        
        :rtype: None
        :UC: none
        :Example:
        >>> cel = Cell()
        >>> cel.is_visited()
        False
        >>> cel.visit()
        >>> cel.is_visited()
        True
        >>> cel.unvisit()
        >>> cel.is_visited()
        False
        
        """
        
        self.__visited = False
        
if __name__ == '__main__':
    import doctest
    doctest.testmod(optionflags=doctest.NORMALIZE_WHITESPACE | doctest.ELLIPSIS, verbose=True)
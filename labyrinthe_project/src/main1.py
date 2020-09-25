#!/usr/bin/python3
# -*- coding: utf-8 -*-

from maze import*
import sys
def usage ():
    '''
    `usage ()` indicates how to use labyrinth game with text mode
    
    '''
    print( "Usage : A labyrinth is represented by a size")
    print( "\t<width> = the width of the labyrinth") ;
    print( "\t<height> = the height of the labyrinth") ;
    print("to search for a path indicate the path to search in the maze by giving the coordinates of the two points as follows x1 y1 x2 y2")
    print('You can see a line that looks like this one: python3 main1.py width height x1 y1 x2 y2')
    exit(1)
    
def main():
    
    """
    Execution of modules of maze's textual mode with a command interpreter
    
    """
    
    if len(sys.argv) == 1:
        maze = Maze()
        maze.paths()
        print(str(maze))
    elif len(sys.argv) == 3:
        w = int(sys.argv[1])
        h = int(sys.argv[2])
        maze = Maze(w,h)
        maze.paths()
        print(str(maze))
    elif len(sys.argv) == 5:
        maze = Maze()
        maze.paths()
        coord_dep = (int(sys.argv[1]),int(sys.argv[2]))
        coord_arv = (int(sys.argv[3]),int(sys.argv[4]))
        maze.point_to_point_path(coord_dep,coord_arv)
        print(str(maze))
    elif len(sys.argv) == 7:
        w = int(sys.argv[1])
        h = int(sys.argv[2])
        coord_dep = (int(sys.argv[3]),int(sys.argv[4]))
        coord_arv = (int(sys.argv[5]),int(sys.argv[6]))
        maze = Maze(w,h)
        maze.paths()
        maze.point_to_point_path(coord_dep,coord_arv)
        print(str(maze))
    else:
        usage()
        
if __name__ == "__main__":
    main()


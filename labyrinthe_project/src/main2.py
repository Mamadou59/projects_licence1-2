#!/usr/bin/python3
# -*- coding: utf-8 -*-

import sys
from graphique import*
def usage ():
    '''
    `usage ()` indicates how to use labyrinth game with graphical mode
    '''
    print( "Usage : A labyrinth is represented by a size")
    print( "\t<width> = the width of the labyrinth") ;
    print( "\t<height> = the height of the labyrinth") ;
    print("to search for a path indicate the path to search in the maze by giving the coordinates of the two points as follows x1 y1 x2 y2")
    print('You can see a line that looks like this one: python3 main2.py width height x1 y1 x2 y2')
    exit(1)
    
def graphe(maze):
    """
    Use the module graphe to draw the maze.
    
    """
    
    win = Tk()
    win.title('<-- Maze_'+str(maze.get_width())+'_'+str(maze.get_height())+" -->")
    can = Canvas(win, bg=BG_COLOR, width=CAN_WIDTH, height=CAN_HEIGHT)
##    can.bind('<Button-1>',
##             lambda event: draw_circle(can,
##                                       event))
    can.pack()
    draw_grid(maze,can, maze.get_width(),maze.get_height())
    if len(sys.argv) >= 5:
        n = len(sys.argv)
        coord_dep = (int(sys.argv[n-4]),int(sys.argv[n-3]))
        coord_arv = (int(sys.argv[n-2]),int(sys.argv[n-1]))
        maze.point_to_point_path(coord_dep,coord_arv)
    button1 = Button(win, text ='chemin',command = lambda: oval(maze,can,maze.get_width(),maze.get_height()))
    button1.pack(side=LEFT, padx=5, pady=5)
    #button2 = Button(fenetre, text ='Bouton 2').pack(side=RIGHT, padx=5, pady=5)
    win.mainloop()

def main():
    """
    Execution of modules of maze's grafical mode with a command interpreter
    
    """
    
    if len(sys.argv) == 1:
        maze = Maze()
        maze.paths()
        print(str(maze)) #to display at the same time the labyrinth on the terminal
        graphe(maze)
        
    elif len(sys.argv) == 3:
        w = int(sys.argv[1])
        h = int(sys.argv[2])
        maze = Maze(w,h)
        maze.paths()
        print(str(maze))
        graphe(maze)
    elif len(sys.argv) == 5:
        maze = Maze()
        maze.paths()
        coord_dep = (int(sys.argv[1]),int(sys.argv[2]))
        coord_arv = (int(sys.argv[3]),int(sys.argv[4]))
        #maze.point_to_point_path(coord_dep,coord_arv)
        print(str(maze))
        graphe(maze)
    elif len(sys.argv) == 7:
        w = int(sys.argv[1])
        h = int(sys.argv[2])
        coord_dep = (int(sys.argv[3]),int(sys.argv[4]))
        coord_arv = (int(sys.argv[5]),int(sys.argv[6]))
        maze = Maze(w,h)
        maze.paths()
        #maze.point_to_point_path(coord_dep,coord_arv)
        print(str(maze))
        graphe(maze)
        
    else:
        usage()
    
if __name__ == "__main__":    
    main()
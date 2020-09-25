#!/usr/bin/python3
# -*- coding: utf-8 -*-
"""
:mod:`graphique` module

:author: DIALLO Mamadou COULIBALY Ivette and SAIDI Mahrez

:date: 05/decembre/2018


"""
from tkinter import *
from maze import*
CAN_WIDTH = 800
CAN_HEIGHT = 600
BG_COLOR = 'green'
GRID_COLOR = 'yellow'

##def draw_circle(canvas, event):
##    """
##    """
##    
##    ray = 5
##    x, y = event.x, event.y
##    canvas.create_oval(x - ray, y - ray,
##                       x + ray, y + ray,
##                       fill = 'red')
##    canvas.update()
def oval(maze,canvas, width, height):
    """
    Draw an oval
    
    :param maze: a object of class Maze
    :type maze: <class '__main__.Maze'>
    :param canvas:  Use to create a drawing area in the window with methods
                    canvas.create_line to draw a segment between two points
                    canvas.create_oval to draw an ellipse inscribed in a rectangular area
                    canvas.update to force the canvas to update after a change
    :type canvas: (Creator)
    :param width: maze's width
    :type width: (int)
    :param height: maze's height
    :type height: (int)
    """
    DX = CAN_WIDTH // width
    DY = CAN_HEIGHT // height
    for y in range(height):
        for x in range(width):
            cel = maze.get_cell(y,x)
            if cel.get_c() == 1:
                canvas.create_oval((x*DX) - 20 + (DX/2), (y*DY) - 20 + (DY/2),
                                    (x* DX) + 20 + (DX / 2), (y*DY) + 20 + (DY/2), fill = 'red')
    
def draw_grid(maze,canvas, width, height):
    """
    draw the grid
    
    :param maze: a object of class Maze
    :type maze: <class '__main__.Maze'>
    :param canvas:  Use to create a drawing area in the window with methods
                    canvas.create_line to draw a segment between two points
                    canvas.create_oval to draw an ellipse inscribed in a rectangular area
                    canvas.update to force the canvas to update after a change
    :type canvas: (Creator)
    :param width: maze's width
    :type width: (int)
    :param height: maze's height
    :type height: (int)
    
    """
    
    DX = CAN_WIDTH // width
    DY = CAN_HEIGHT // height
    for y in range(height):
        for x in range(width):
            cel = maze.get_cell(y,x)
            if cel.get_direction_situation() & 2 == 0: #horizontal
                canvas.create_line(x * DX,(y+1) * DY,
                                   (x + 1) * DX, (y+1) * DY,
                                   fill=GRID_COLOR, width=1)
            if cel.get_direction_situation() & 4 == 0: #vertical
                canvas.create_line((x+1) * DX, y * DY,
                                   (x+1) * DX, (y + 1) * DY,
                                   fill=GRID_COLOR, width=1)
##            if cel.get_c() == 1:
##                canvas.create_oval((x*DX) - 20 + (DX/2), (y*DY) - 20 + (DY/2),
##                                   (x* DX) + 20 + (DX / 2), (y*DY) + 20 + (DY/2), fill = 'red')
    
    canvas.create_line(width * DX - 1, 0,  width * DX - 1, height * DY - 1,
                       fill=GRID_COLOR, width=1)
    canvas.create_line(0, height * DY - 1,  width * DX - 1, height * DY - 1,
                       fill=GRID_COLOR, width=1)

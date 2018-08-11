# Blocktrain
Javascript OOP implementation of Tetris game in the browser, with machine learning and a retro aesthetic.

Made in vanilla JS, HTML5, Canvas, and CSS3.

[Play!](http://dwu.space/blocktrain/)

![screenshot](https://i.imgur.com/Vrb97ix.png)

## Machine learning demo
There is a demonstration of machine learning using a genetic algorithm. Such an algorithm
is heavily influenced by the theory of Darwinian evolution, or more specifically, the theory
of natural selection. Genetic mutations produce favorable advantages to certain individuals
in a population, increasing their chances of surviving and producing offspring, which then
inherit the advantageous mutation. Eventually, throughout many generations, individuals
in a population are much more fit to live (or, in this case, to play Tetris).

We start with a population of 50 individuals with randomly assigned weights. 

## Gameplay
Press the arrow keys/WSAD to move the current piece. Up arrow or W will rotate the piece.
Spacebar will drop the piece straight down and set it on the board.

If you'd like to play silently, the 'm' key will toggle the audio.

## Technical features
* LRU cache
    * Tracks the last three most recently sent pieces
    * Ensures that a specific piece can repeat at most once every four pieces, so user experience is kept pleasant
* Efficient board rendering
    * Rotating or moving a piece into a valid new position on the board occurs before new board state is rendered
* Rotation handling
    * Since board rendering occurs only after a position is valid, invalid rotations are first allowed
    * The game will try to keep the invalid rotation and find the nearest valid position
    * If a valid position is found, the rotated piece is moved there - if not, the rotated piece is un-rotated
        * The board is then re-rendered. So, in the case of an invalid rotation the user does not notice any change, and the game proceeds smoothly.

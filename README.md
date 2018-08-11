# Blocktrain
Javascript OOP implementation of Tetris game in the browser, with machine learning and a retro aesthetic.

Made in vanilla JS, HTML5, Canvas, and CSS3.

[Play!](http://dwu.space/blocktrain/)

![screenshot](https://i.imgur.com/Vrb97ix.png)

## Machine learning demo
There is a demonstration of machine learning using a [genetic algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm). Such an algorithm
is heavily influenced by the theory of Darwinian evolution, or more specifically, the theory
of natural selection. Genetic mutations produce favorable advantages to certain individuals
in a population, increasing their chances of surviving and producing offspring, which then
inherit the advantageous mutation. Eventually, throughout many generations, individuals
in a population are much more fit to live (or, in this case, to play Tetris).

At a high level:

* We start with a population of 50 individuals with randomly assigned weights, via createInitialPopulation():
```
{
   			id: Math.random(),
   			rowsCleared: Math.random() - 0.5,
   			weightedHeight: Math.random() - 0.5,
   			cumulativeHeight: Math.random() - 0.5,
   			relativeHeight: Math.random() - 0.5,
   			holes: Math.random() * 0.5,
   			roughness: Math.random() - 0.5,
      }
```
* We start playing a game of Tetris, using the first individual generated. The game is played by determining the best next move at each step of the game, based on the individual's weights. For example, if the individual has a negative value for its ```rowsCleared``` key, then making the next move will most likely not result in any rows being cleared on the board. 
* When the current game is over, or when a certain number of moves have been made, the final score is tallied for the current game and assigned as the fitness of the current individual influencing the game. Then, we move on to the next individual in the population, clear the board, and start a new game for that new individual. 

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

# Blocktrain
Javascript OOP implementation of Tetris game in the browser, with machine learning and a retro aesthetic.

Inspired by TetNet project from https://github.com/IdreesInc/

Made in vanilla JS, HTML5, Canvas, and CSS3.

[Play!](https://ddwu.me/blocktrain/)

![screenshot](https://i.imgur.com/Vrb97ix.png)

## Machine learning demo
There is a demonstration of machine learning using a [genetic algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm) (press 'A' before playing to see the demo). 

Such an algorithm is heavily influenced by the theory of Darwinian evolution. Genetic mutations produce favorable advantages to certain individuals
in a population, increasing their chances of surviving and producing offspring, which then
inherit the advantageous mutation. Eventually, throughout many generations, individuals
in a population are much more fit to live (or, in this case, to play Tetris).

### High level overview

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
* We start playing a game of Tetris with one individual. The game is played by determining the best next move at each step of the game, based on the current individual's weights. For example, if the individual has a negative value for its ```rowsCleared``` key, then making the next move will most likely not result in any rows being cleared on the board. 
* Moves are decided upon, made, and then displayed to the user via makeNextMove(); moveIteration() wraps makeNextMove() and adds piece updating functionality when the most recent move has just been made. 
```  
moveIteration() {
    this.offset.y = 0;
    this.offset.x = 4;
    this.totalRotations = 0;
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.pieces.newPiece();
    this.makeNextMove();
  }
```
* When the current game is over, or when a certain number of moves have been made, the final score is tallied for the current game and assigned as the fitness of the current individual influencing the game. Then, we move on to the next individual in the population, clear the board, and start a new game for that new individual - this happens via boardIteration():
```
  boardIteration() {
    this.genomes[this.genomeIndex].fitness = this.score;
    this.scrubBoard();
    this.evaluateNextGenome();
  }
```
* When we reach the last individual in a generation, we pick the fittest individuals in the population to produce offspring, and the new generation is a mix of all the offspring and their parents. This happens via evolve():
```
this.genomes.sort( (a,b) => {
      return b.fitness - a.fitness;
    });
    let fittest = this.genomes.slice(0,Math.floor(this.populationSize/2));
    let children = [this.genomes[0]];
    while (children.length < this.populationSize) {
      children.push(this.makeChild(fittest));
    }
    this.genomes = children;
```

### Results
* By generation 25 we should expect to see individuals that have an influence on making the next move such that the game score is optimized - in other words, the game is played in such a way that:
    * Row clears are positively weighted
    * Holes (i.e. empty spots in the board that exist below a placed piece) are negatively weighted
    * Etcetera 
* The machine learning demo begins at generation 25 due to the reason above - we want to provide the user the pleasure of experiencing a skilled Tetris demonstration off the bat. 


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

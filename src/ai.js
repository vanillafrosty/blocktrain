import Game from './game';
import * as boardUtil from './util';
import ShadowBoard from './shadowBoard';

export default class AIGame extends Game {

  constructor(board) {
    super(board);
    this.populationSize = 6;
    this.genomes = [];
    this.genomeIndex = -1;
    this.movesTaken = 0;
    this.movesLimit = 500;
    this.createInitialPopulation();
    this.timeStep = 10;
    this.score = 0;
    this.generation = 0;
    this.mutationRate = 0.05;
    this.mutationStep = 0.2;
    this.speedArr = [300, 120, 10, 0];
    this.speedIndex = 2;
  }


  createInitialPopulation() {
    let genome;
    for (let i=0; i<this.populationSize; i++) {
      genome = {
   			id: Math.random(),
   			rowsCleared: Math.random() - 0.5,
   			weightedHeight: Math.random() - 0.5,
   			cumulativeHeight: Math.random() - 0.5,
   			relativeHeight: Math.random() - 0.5,
   			holes: Math.random() * 0.5,
   			roughness: Math.random() - 0.5,
      }
      this.genomes.push(genome);
    }
    this.evaluateNextGenome();
  }

  evaluateNextGenome() {
    this.score = 0;
    this.genomeIndex += 1;
    if (this.playingGame) {
      let aiDisplay = document.getElementById('ai-display');
      aiDisplay.children[1].innerHTML = `current genome: ${this.genomeIndex+1}/${this.populationSize}`;
      if (this.genomeIndex >= this.genomes.length) {
        this.evolve();
        aiDisplay.children[1].innerHTML = `current genome: ${this.genomeIndex+1}/${this.populationSize}`;
      }
    }
    this.movesTaken = 0;
    this.makeNextMove();
  }

  makeNextMove() {
    this.movesTaken += 1;
    if (this.movesTaken > this.movesLimit) {
      //evaluate the score for the current genome, and move to the next genome
      this.genomes[this.genomeIndex].fitness = this.score;
      this.evaluateNextGenome();
    } else {
      let bestFutureMove, bestCurrentMove;
      //possible moves with this.currentPiece
      let possibleMoves = this.getPossibleMoves(this.board, this.currentPiece);
      for (let i=0; i<possibleMoves.length; i++) {
        this.shadowBoard = new ShadowBoard(boardUtil.deepDup(this.board.grid));
        this.shadowMove(possibleMoves[i], this.currentPiece);
        bestFutureMove = this.getHighestRatedMove(this.getPossibleMoves(this.shadowBoard, this.nextPiece));
        if (bestFutureMove) {
          possibleMoves[i].rating += bestFutureMove.rating;
        }
      }
      bestCurrentMove = this.getHighestRatedMove(possibleMoves);
      //based on the bestCurrentMove, move this.currentPiece and set it on this.board
      this.updateScore(bestCurrentMove);
      //make sure realMove does not update this.offset.x to be NaN
      //if bestCurrentMove is not a real move.
      this.realMove(bestCurrentMove, this.currentPiece);
      //draw stuff because we just made the best move
      this.boardStep();
    }
  }

  updateScore(move) {
    if (!move) {
      return true;
    }
    this.score += move.drop;
    switch(move.rotations) {
      case 1:
        this.score += 400;
        return true;
      case 2:
        this.score += 1000;
        return true;
      case 3:
        this.score += 3000;
        return true;
      case 4:
        this.score += 12000;
        return true;
    }
  }

  getPossibleMoves(board, piece) {
    let origOffset = {
      x: this.offset.x,
      y: this.offset.y
    };
    let possibleMoves = [];
    let rotationsHsh = {
      'T': 4,
      'O': 1,
      'J': 4,
      'L': 4,
      'Z': 2,
      'S': 2,
      'I': 2
    }
    let rotations = rotationsHsh[piece.type];
    for (let i=1; i<=rotations; i++) {
      //since handleRotate is destructive, just keep rotating once.
      //call multiRotate some other time.
      piece = this.handleRotate(piece);
      for (let trans=-5; trans<=5; trans++) {
        let gameOver = false;
        this.offset.x = origOffset.x;
        this.offset.y = origOffset.y;
        this.offset.x += trans;
        if (board.validPos(piece.matrix, this.offset)) {
          let minDelta = boardUtil.deltaY(piece.matrix, this.offset, board.rows, board.grid);
          this.offset.y += minDelta;
          board.setPiece(piece.matrix, this.offset.x, this.offset.y-1);
          let rowsCleared = board.fullRows(piece.length, this.offset.y-1);
          if (rowsCleared === 0) {
            gameOver = board.checkGameOver(this.nextPiece.matrix, origOffset);
          }
          let algorithm = {
  					rowsCleared: rowsCleared,
  					weightedHeight: Math.pow(board.getMaxHeight(), 1.5),
  					cumulativeHeight: board.getCumulativeHeight(rowsCleared),
  					relativeHeight: board.getRelativeHeight(),
  					holes: board.getHoles(),
  					roughness: board.getRoughness()
          };
   				let rating = 0;
   				rating += algorithm.rowsCleared * this.genomes[this.genomeIndex].rowsCleared;
   				rating += algorithm.weightedHeight * this.genomes[this.genomeIndex].weightedHeight;
   				rating += algorithm.cumulativeHeight * this.genomes[this.genomeIndex].cumulativeHeight;
   				rating += algorithm.relativeHeight * this.genomes[this.genomeIndex].relativeHeight;
   				rating += algorithm.holes * this.genomes[this.genomeIndex].holes;
   				rating += algorithm.roughness * this.genomes[this.genomeIndex].roughness;
   				//if the move loses the game, slam its rating
   				if (gameOver) {
   					rating -= 500;
   				}
          board.removePiece(piece.matrix, this.offset.x, this.offset.y-1);
   				//push all possible moves, with their associated ratings and parameter values to an array
   				possibleMoves.push({rotations: i, translation: trans, rating: rating, algorithm: algorithm, drop: minDelta-1});
        }
      }
    }
    this.offset = origOffset;
    this.totalRotations = 0;
    return possibleMoves;
  }

  multiRotate(piece, rotations) {
    for (let r=0; r<rotations; r++) {
      piece = this.handleRotate(piece);
    }
    return piece;
  }

  shadowMove(move, piece) {
    let origPiece = boardUtil.deepDup(piece.matrix);
    piece = this.multiRotate(piece, move.rotations);
    let shadowOffset = {
      x: this.offset.x,
      y: this.offset.y
    }
    shadowOffset.x += move.translation;
    this.shadowBoard.handleDrop(piece.matrix, shadowOffset);
    piece.matrix = origPiece;
  }

  realMove(move, piece) {
    if (!move) {
      return true;
    }
    piece = this.multiRotate(piece, move.rotations);
    this.offset.x += move.translation;
    this.totalRotations = 0;
    // this.board.setPiece(piece.matrix, this.offset.x, this.offset.y);

  }

  getHighestRatedMove(moves) {
    let highestMove = moves[0];
    if (moves.length === 0) {
      return null;
    }
    for (let i=1; i<moves.length; i++) {
      if (moves[i].rating > highestMove.rating) {
        highestMove = moves[i];
      }
    }
    return highestMove;
  }

  play() {
    if (this.playingGame || this.gameOver) {
      return true;
    } else {
      this.playingGame = true;
      this.megamanAudio.play();
      this.megamanPlaying = true;


      if (!this.gameOverOnce) {
        let gameStart = document.getElementById('before-game-start');
        gameStart.setAttribute("id", "game-start");
        let controls = document.getElementById('controls-container');
        while (controls.children.length > 1) {
          controls.removeChild(controls.children[1]);
        }
        let aiDisplay = document.getElementById('ai-display-none');
        aiDisplay.setAttribute("id", "ai-display");
        aiDisplay.children[0].append(` ${this.generation}`);
        aiDisplay.children[1].append(` ${this.genomeIndex+1}/${this.populationSize}`)
      }

      const render = (timestamp) => {
        this.resetTime += timestamp-this.startTime;

        if (this.resetTime > this.timeStep) {
          this.resetTime = 0;
          this.offset.y += 1;
          if (this.board.update(this.currentPiece.matrix, this.offset)){
            this.offset.y = 0;
            this.offset.x = 4;
            this.totalRotations = 0;
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.pieces.newPiece();
            this.makeNextMove();
          }
          this.boardStep();
          this.gameOver = this.board.checkGameOver(this.currentPiece.matrix, this.offset);
          if (this.gameOver) {
            this.genomes[this.genomeIndex].fitness = this.score;
            this.score = 0;
            this.totalRotations = 0;
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.pieces.newPiece();
            this.board.emptyBoard();
            this.evaluateNextGenome();
          }
        }
        this.startTime = timestamp;
        this.animationFrame = requestAnimationFrame(render);
      }

      this.animationFrame = requestAnimationFrame((timestamp) => {
        this.startTime = timestamp;
        this.board.drawPiece(this.currentPiece.matrix, this.offset);
        this.board.drawNext(this.nextPiece.matrix);
        render(timestamp);
      });
    }
  }

  evolve() {
    console.log("evolving!");
    console.log("old genomes");
    this.generation += 1;
    let node = document.getElementById('ai-display');
    node.children[0].innerHTML = (`current generation: ${this.generation}`);
    this.genomeIndex = 0;
    this.score = 0;
    this.movesTaken = 0;
    this.totalRotations = 0;
    this.board.emptyBoard();
    this.currentPiece = this.pieces.newPiece();
    this.nextPiece = this.pieces.newPiece();
    this.genomes.sort( (a,b) => {
      return b.fitness - a.fitness;
    });
    console.log(this.genomes);
    let fittest = this.genomes.slice(0,Math.floor(this.populationSize/2));
    let children = [this.genomes[0]];
    while (children.length < this.populationSize) {
      children.push(this.makeChild(fittest));
    }
    this.genomes = children;
    console.log(this.genomes);

  }

  makeChild(genomes) {
    let mom = genomes[boardUtil.randNumRange(0, genomes.length-1)];
    let dad = genomes[boardUtil.randNumRange(0, genomes.length-1)];
    while (dad === mom) {
      dad = genomes[boardUtil.randNumRange(0, genomes.length-1)];
    }
    let child = {
      id : Math.random(),
      rowsCleared: boardUtil.randSelect(mom.rowsCleared, dad.rowsCleared),
      weightedHeight: boardUtil.randSelect(mom.weightedHeight, dad.weightedHeight),
      cumulativeHeight: boardUtil.randSelect(mom.cumulativeHeight, dad.cumulativeHeight),
      relativeHeight: boardUtil.randSelect(mom.relativeHeight, dad.relativeHeight),
      holes: boardUtil.randSelect(mom.holes, dad.holes),
      roughness: boardUtil.randSelect(mom.roughness, dad.roughness),
      fitness: -1
    };
    if (Math.random() < this.mutationRate) {
   		child.rowsCleared = child.rowsCleared + Math.random() * this.mutationStep * 2 - this.mutationStep;
   	}
   	if (Math.random() < this.mutationRate) {
   		child.weightedHeight = child.weightedHeight + Math.random() * this.mutationStep * 2 - this.mutationStep;
   	}
   	if (Math.random() < this.mutationRate) {
   		child.cumulativeHeight = child.cumulativeHeight + Math.random() * this.mutationStep * 2 - this.mutationStep;
   	}
   	if (Math.random() < this.mutationRate) {
   		child.relativeHeight = child.relativeHeight + Math.random() * this.mutationStep * 2 - this.mutationStep;
   	}
   	if (Math.random() < this.mutationRate) {
   		child.holes = child.holes + Math.random() * this.mutationStep * 2 - this.mutationStep;
   	}
   	if (Math.random() < this.mutationRate) {
   		child.roughness = child.roughness + Math.random() * this.mutationStep * 2 - this.mutationStep;
   	}
    return child;

  }


}

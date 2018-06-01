import LRUCache from './lru/cache';

export default class Pieces {

  constructor() {
    this.pieces = {
      'I': [[0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]],
      'O': [[0,0,0,0],
            [0,2,2,0],
            [0,2,2,0],
            [0,0,0,0]],
      'T': [[0,0,0],
            [3,3,3],
            [0,3,0]],
      'L': [[0,4,0],
            [0,4,0],
            [0,4,4]],
      'J': [[0,5,0],
            [0,5,0],
            [5,5,0]],
      'Z': [[0,0,0],
            [6,6,0],
            [0,6,6]],
      'S': [[0,0,0],
            [0,7,7],
            [7,7,0]]
    };
    this.bag = ['I','O','T','L','J','Z','S'];
    this.lru = new LRUCache(3, this.pieces);
  }

  //the fisher-yates shuffle
  shuffle() {
    let randomIndex, current;
    for (let i=this.bag.length-1; i>=0; i--) {
      randomIndex = Math.floor(Math.random()*(i+1));
      current = this.bag[i];
      this.bag[i] = this.bag[randomIndex];
      this.bag[randomIndex] = current;
    }
    return this.bag;
  }

  newPiece() {
    let piece = this.shuffle()[0];
    while (this.lru.map[piece] !== undefined) {
      piece = this.shuffle()[0];
    }
    this.lru.get(piece);
    // debugger;
    return {
      type: piece,
      matrix: this.lru.map[piece].val
    };
  }

}

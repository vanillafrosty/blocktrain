export default class Board {

  constructor(width, height, ctx) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    // this.rows = 24;
    this.rows = 20;
    this.cols = 10;
    this.grid = [];
    this.strokeStyle = '#000000';
    this.square_width = width/this.cols;
    for (let i=0; i<this.rows; i++) {
      this.grid[i] = new Array(this.cols);
    }
    this.colors = {
      1: '#E24242',
      2: '#F5DC41',
      3: '#CC41F5',
      4: '#3E4AE8',
      5: '#3EE0E8',
      6: '#3EE848',
      7: '#F14D17'
    };
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let s_w = this.square_width;
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (typeof(this.grid[i][j]) !== 'undefined') {
          this.ctx.fillStyle = this.colors[this.grid[i][j]];
          this.ctx.strokeStyle = this.strokeStyle;
          this.ctx.lineWidth = 2;
          let x = j*s_w;
          let y = i*s_w;
          this.ctx.fillRect(x, y, s_w, s_w);
          this.ctx.strokeRect(x, y, s_w, s_w);
          this.ctx.beginPath();
          this.ctx.moveTo(x+s_w/4, y+s_w*(3/4));
          this.ctx.lineTo(x+s_w/4, y+s_w/4);
          this.ctx.lineTo(x+s_w*(3/4), y+s_w/4);
          this.ctx.stroke();
        }
      }
    }
  }

  drawPiece(piece, offset) {
    let s_w = this.square_width;
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          this.ctx.fillStyle = this.colors[piece[i][j]];
          this.ctx.strokeStyle = this.strokeStyle;
          this.ctx.lineWidth = 2;
          let x = (offset.x+j)*s_w;
          let y = (offset.y+i)*s_w;
          this.ctx.fillRect(x, y, s_w, s_w);
          this.ctx.strokeRect(x, y, s_w, s_w);
          this.ctx.beginPath();
          this.ctx.moveTo(x+s_w/4, y+s_w*(3/4));
          this.ctx.lineTo(x+s_w/4, y+s_w/4);
          this.ctx.lineTo(x+s_w*(3/4), y+s_w/4);
          this.ctx.stroke();
        }
      }
    }
  }

  update(piece, offset) {
    if (offset.y < 0) {
      return false;
    }
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          let x = offset.x+j;
          let y = offset.y+i;
          if (y >= this.rows || typeof(this.grid[y][x]) !== 'undefined') {
            this.setPiece(piece, offset.x, offset.y-1);
            return true;
          }
        }
      }
    }
    return false;
  }


  //updates the grid with the piece values
  setPiece(piece, x, y) {
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          this.grid[y+i][x+j] = piece[i][j];
        }
      }
    }
  }

  //checks that a number is between a lower and higher bound (inclusive)
  between(num, low, high) {
    if (num < low || num > high) {
      return false;
    } else {
      return true;
    }
  }

  validPos(piece, offset) {
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          let x = offset.x+j;
          let y = offset.y+i;
          if (!this.between(x, 0, this.cols-1) || !this.between(y, 0, this.rows-1)) {
            return false;
          }
          if (typeof(this.grid[y][x]) !== 'undefined') {
            return false;
          }
        }
      }
    }
    return true;
  }

  //helper method for validateRotate
  handleResponse(piece, offset, newOffset) {
    if (this.validPos(piece, newOffset)) {
      return {
        reRotate: false,
        offset: newOffset
      };
    } else {
      return {
        reRotate: true,
        offset: offset
      };
    }
  }

  //helper method for validateRotate
  handleX(x, piece, offset) {
    let newOffset = {
      x: offset.x,
      y: offset.y
    };
    if (this.between(x, 0, this.cols-1)) {
      return null;
    }
    else if (x < 0) {
      newOffset.x += 1;
      return this.handleResponse(piece, offset, newOffset);
    }
    else if (x > (this.cols-1)) {
      newOffset.x -=1;
      return this.handleResponse(piece, offset, newOffset);
    }
  }

  handleY(y, piece, offset) {
    let newOffset = {
      x: offset.x,
      y: offset.y
    };
    if (this.between(y, 0, this.rows-1)) {
      return null;
    }
    else if (y < 0) {
      newOffset.y += 1;
      return this.handleResponse(piece, offset, newOffset);
    }
    else if (y > (this.rows-1)) {
      newOffset.y -=1;
      return this.handleResponse(piece, offset, newOffset);
    }
  }

  validateRotate(piece, offset) {
    let newOffset = {
      x: offset.x,
      y: offset.y
    };
    let handledX, handledY;
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          let x = offset.x+j;
          let y = offset.y+i;
          handledX = this.handleX(x, piece, offset);
          if (handledX) {
            return handledX;
          }
          handledY = this.handleY(y, piece, offset);
          if (handledY) {
            return handledY;
          }
        }
      }
    }
    return {
      reRotate: false,
      offset: offset
    }
  }





}

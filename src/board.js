export default class Board {

  constructor(width, height, ctx, nextPieceCtx) {
    this.ctx = ctx;
    this.nextPieceCtx = nextPieceCtx;
    this.width = width;
    this.height = height;
    this.rows = 21;
    this.cols = 10;
    this.grid = [];
    this.strokeStyle = '#000000';
    this.outlineStrokeStyle = '#F9F9F9';
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
    this.emptyBoard = this.emptyBoard.bind(this);
  }

  emptyBoard() {
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        this.grid[i][j] = undefined;
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (typeof(this.grid[i][j]) !== 'undefined') {
          let x = j*this.square_width;
          let y = i*this.square_width;
          let color = this.colors[this.grid[i][j]];
          this.drawSquare(x,y, color);
        }
      }
    }
  }

  drawPiece(piece, offset) {
    let minDelta, dy;
    let dupOffset = {
      x: offset.x,
      y: offset.y
    };
    for (let i=0; i<piece.length; i++){
      for (let j=0; j<piece[0].length; j++){
        if (piece[i][j] !== 0) {
          dy = 0;
          while((i+offset.y+dy) < this.rows && !this.grid[i+offset.y+dy][j+offset.x]){
            dy += 1;
          }
          if (!minDelta || dy < minDelta) { minDelta = dy; }
        }
      }
    }
    dupOffset.y += minDelta-1;
    let x, y, maxY, color;
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          x = (offset.x+j)*this.square_width;
          y = (offset.y+i)*this.square_width;
          maxY = (dupOffset.y+i)*this.square_width;
          color = this.colors[piece[i][j]];
          this.drawSquare(x, y, color);
          this.drawSquareOutline(x, maxY, color);
        }
      }
    }
    // this.drawOutline(piece, dupOffset);
  }


  drawNext(piece) {
    const offset = {
      x: 0,
      y: 1
    };
    //hard code width and height for now
    this.nextPieceCtx.clearRect(0, 0, 120, 150);
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          let x = (offset.x+j)*this.square_width;
          let y = (offset.y+i)*this.square_width;
          let color = this.colors[piece[i][j]];
          this.drawNextSquare(x, y, color);
        }
      }
    }
  }

  drawNextSquare(x, y, color){
    const s_w = this.square_width;
    this.nextPieceCtx.fillStyle = color;
    this.nextPieceCtx.strokeStyle = this.strokeStyle;
    this.nextPieceCtx.lineWidth = 2;
    this.nextPieceCtx.fillRect(x, y, s_w, s_w);
    this.nextPieceCtx.strokeRect(x, y, s_w, s_w);
    this.nextPieceCtx.beginPath();
    this.nextPieceCtx.moveTo(x+s_w/4, y+s_w*(3/4));
    this.nextPieceCtx.lineTo(x+s_w/4, y+s_w/4);
    this.nextPieceCtx.lineTo(x+s_w*(3/4), y+s_w/4);
    this.nextPieceCtx.stroke();
  }

  drawSquare(x, y, color)  {
    const s_w = this.square_width;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(x, y, s_w, s_w);
    this.ctx.strokeRect(x, y, s_w, s_w);
    this.ctx.beginPath();
    this.ctx.moveTo(x+s_w/4, y+s_w*(3/4));
    this.ctx.lineTo(x+s_w/4, y+s_w/4);
    this.ctx.lineTo(x+s_w*(3/4), y+s_w/4);
    this.ctx.stroke();
  }

  drawSquareOutline(x, y, color) {
    const s_w = this.square_width;
    this.ctx.strokeStyle = this.outlineStrokeStyle;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, s_w, s_w);
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
            this.clearRows(piece.length, offset.y-1);
            return true;
          }
        }
      }
    }
    return false;
  }

  clearRows(numRows, startY){
    for (let i=0; i<numRows; i++) {
      if (this.fullRow(startY+i)) {
        this.removeRow(startY+i);
      }
    }
  }

  fullRow(row_idx){
    let row = this.grid[row_idx];
    if (row === undefined) {
      return false;
    }
    for (let i=0; i<row.length; i++) {
      if (typeof(row[i]) === 'undefined') {
        return false;
      }
    }
    return true;
  }

  removeRow(row_idx) {
    let row = this.grid[row_idx];
    for (let i=row_idx-1; i>=0; i--) {
      for (let j=0; j<row.length; j++){
        this.grid[i+1][j] = this.grid[i][j];
      }
    }
    for (let j=0; j<row.length; j++){
      this.grid[0][j] = undefined;
    }
  }

  //updates the grid with the piece values
  setPiece(piece, x, y) {
    // debugger;
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
      //reminder: may want to subtract Math.floor(piece.length/2)
      //to account for the line pieces hugging the right side of the board
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
          if (typeof(this.grid[y][x]) !== 'undefined') {
            if (this.rightOrLeft(piece, x) === 'left') {
              newOffset.x += 1;
              //try moving the piece up one before giving up
              let response = this.handleResponse(piece, offset, newOffset);
              if (response.reRotate){
                newOffset.x -= 1;
                newOffset.y -= 1;
                return this.handleResponse(piece, offset, newOffset);
              }
              return response;
            } else if (this.rightOrLeft(piece, x) === 'right'){
              newOffset.x -=1;
              let response = this.handleResponse(piece, offset, newOffset);
              if (response.reRotate) {
                newOffset.x += 1;
                newOffset.y -= 1;
                return this.handleResponse(piece, offset, newOffset);
              }
              return response;
            }
          }
        }
      }
    }
    return {
      reRotate: false,
      offset: offset
    }
  }

  rightOrLeft(piece, x) {
    let middle = Math.floor(piece.length/2);
    return (x < middle ? 'left':'right');
  }

  handleDrop(piece, offset) {
    let minDelta, dy;
    for (let i=0; i<piece.length; i++){
      for (let j=0; j<piece[0].length; j++){
        if (piece[i][j] !== 0) {
          dy = 0;
          while((i+offset.y+dy) < this.rows && !this.grid[i+offset.y+dy][j+offset.x]){
            dy += 1;
          }
          if (!minDelta || dy < minDelta) { minDelta = dy; }
        }
      }
    }
    offset.y += minDelta;
    this.setPiece(piece, offset.x, offset.y-1);
    this.clearRows(piece.length, offset.y-1);
  }

  checkGameOver(piece, offset) {
    if (offset.y !== 0) { return false; }
    if (!this.validPos(piece, offset)) {
      return true;
    }
    return false;
  }

}

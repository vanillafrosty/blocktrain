import * as boardUtil from './util';

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
    let minDelta;
    let dupOffset = {
      x: offset.x,
      y: offset.y
    };
    minDelta = boardUtil.deltaY(piece, offset, this.rows, this.grid);
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
          //we allow y>=this.rows because update is used to set a piece at
          //the very bottom of the board (in a fresh game). this.grid[y][x]
          //fails as a check in this case.
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
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          this.grid[y+i][x+j] = piece[i][j];
        }
      }
    }
  }

  validPos(piece, offset) {
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          let x = offset.x+j;
          let y = offset.y+i;
          if (!boardUtil.between(x, 0, this.cols-1) || !boardUtil.between(y, 0, this.rows-1)) {
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
    if (boardUtil.between(x, 0, this.cols-1)) {
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
    if (boardUtil.between(y, 0, this.rows-1)) {
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

  handleP(x, piece, offset) {
    let newOffset = {
      x: offset.x,
      y: offset.y
    };
    if (boardUtil.rightOrLeft(piece, x) === 'left') {
      newOffset.x += 1;
      //try moving the piece up one before giving up
      let response = this.handleResponse(piece, offset, newOffset);
      if (response.reRotate){
        newOffset.x -= 1;
        newOffset.y -= 1;
        return this.handleResponse(piece, offset, newOffset);
      }
      return response;
    } else if (boardUtil.rightOrLeft(piece, x) === 'right'){
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

  validateRotate(piece, offset) {
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
            return this.handleP(x, piece, offset);

          }
        }
      }
    }
    return {
      reRotate: false,
      offset: offset
    }
  }

  handleDrop(piece, offset) {
    let minDelta;
    minDelta = boardUtil.deltaY(piece, offset, this.rows, this.grid);
    offset.y += minDelta;
    this.setPiece(piece, offset.x, offset.y-1);
    this.clearRows(piece.length, offset.y-1);
  }

  checkGameOver(piece, offset) {
    if (offset.y !== 0) { return false; }
    if (!this.validPos(piece, offset)) {
      // console.log(this.grid);
      // console.log(piece);
      // console.log(offset);
      // let a = this.grid;
      // debugger;
      return true;
    }
    return false;
  }

  /*
   █████  ██     ███    ███ ███████ ████████ ██   ██  ██████  ██████  ███████
  ██   ██ ██     ████  ████ ██         ██    ██   ██ ██    ██ ██   ██ ██
  ███████ ██     ██ ████ ██ █████      ██    ███████ ██    ██ ██   ██ ███████
  ██   ██ ██     ██  ██  ██ ██         ██    ██   ██ ██    ██ ██   ██      ██
  ██   ██ ██     ██      ██ ███████    ██    ██   ██  ██████  ██████  ███████
  */



  fullRows(numRows, startY){
    let total = 0;
    for (let i=0; i<numRows; i++) {
      if (this.fullRow(startY+i)) {
        total += 1;
      }
    }
    return total;
  }

  getMaxHeight() {
    let peaksRemaining = 10;
    let maxPeak = 0;
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (peaksRemaining === 0) {
          break;
        }
        if (this.grid[i][j] !== undefined) {
          peaksRemaining -= 1;
          if ((this.rows - i) > maxPeak) {
            maxPeak = this.rows-i;
          }
        }
      }
    }
    return maxPeak;
  }

  getCumulativeHeight(fullRows) {
    let peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    let peaksRemaining = 10;
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (peaksRemaining === 0) {
          break;
        }
        if (this.grid[i][j] !== undefined && peaks[j] < 0) {
          peaks[j] = this.rows-i;
          peaksRemaining -= 1;
        }
      }
    }
    let cumulativeHeight = 0;
    for (let p=0; p<peaks.length; p++) {
      if (peaks[p] > 0) {
        cumulativeHeight += peaks[p];
      }
    }
    //do the below because remember we're not actually clearing rows,
    //just keeping track of how many rows are filled
    return cumulativeHeight - (fullRows*10);
  }

  getRelativeHeight() {
    let peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    let peaksRemaining = 10;
    let minPeak = 99;
    let maxPeak = 0;
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (peaksRemaining === 0) {
          break;
        }
        if (this.grid[i][j] !== undefined && peaks[j] < 0) {
          peaks[j] = this.rows-i;
          peaksRemaining -= 1;
          if (peaks[j] > maxPeak) {
            maxPeak = peaks[j];
          }
          if (peaks[j] < minPeak) {
            minPeak = peaks[j];
          }
        }
      }
    }
    return maxPeak - minPeak;
  }

  getHoles() {
    let peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    let peaksRemaining = 10;
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (peaksRemaining === 0) {
          break;
        }
        if (this.grid[i][j] !== undefined && peaks[j] < 0) {
          peaks[j] = this.rows-i;
          peaksRemaining -= 1;
        }
      }
    }
    let holes = 0;
    for (let p=0; p<peaks.length; p++) {
      for (let row=20; row>(this.rows-peaks[p]); row--) {
        if (this.grid[row][p] === undefined) {
          holes += 1;
        }
      }
    }
    return holes;
  }

  //roughness is the sum of relative height differences between columns
  getRoughness() {
    let roughness = 0;
    let peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    let peaksRemaining = 10;
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (peaksRemaining === 0) {
          break;
        }
        if (this.grid[i][j] !== undefined && peaks[j] < 0) {
          peaks[j] = this.rows-i;
          peaksRemaining -= 1;
        }
      }
    }
    for (let p=0; p<peaks.length-1; p++) {
      let currPeak = peaks[p+1] < 0 ? 0 : peaks[p+1];
      roughness += Math.abs(peaks[p] - currPeak);
    }
    return roughness;
  }

  removePiece(piece, x, y) {
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          this.grid[y+i][x+j] = undefined;
        }
      }
    }
  }


}

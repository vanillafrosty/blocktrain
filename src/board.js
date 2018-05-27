export default class Board {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rows = 24;
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
      7: '#F3C73D'
    };
    this.render = this.render.bind(this);
    this.drawPiece = this.drawPiece.bind(this);
    this.update = this.update.bind(this);
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    let s_w = this.square_width;
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (typeof(this.grid[i][j]) !== 'undefined') {
          ctx.fillStyle = this.colors[this.grid[i][j]];
          ctx.strokeStyle = this.strokeStyle;
          ctx.lineWidth = 2;
          let x = j*s_w;
          let y = i*s_w;
          ctx.fillRect(x, y, s_w, s_w);
          ctx.strokeRect(x, y, s_w, s_w);
          ctx.beginPath();
          ctx.moveTo(x+s_w/4, y+s_w*(3/4));
          ctx.lineTo(x+s_w/4, y+s_w/4);
          ctx.lineTo(x+s_w*(3/4), y+s_w/4);
          ctx.stroke();
        }
      }
    }
  }

  drawPiece(piece, offset, ctx) {
    let s_w = this.square_width;
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          ctx.fillStyle = this.colors[piece[i][j]];
          ctx.strokeStyle = this.strokeStyle;
          ctx.lineWidth = 2;
          let x = (offset.x+j)*s_w;
          let y = (offset.y+i)*s_w;
          ctx.fillRect(x, y, s_w, s_w);
          ctx.strokeRect(x, y, s_w, s_w);
          ctx.beginPath();
          ctx.moveTo(x+s_w/4, y+s_w*(3/4));
          ctx.lineTo(x+s_w/4, y+s_w/4);
          ctx.lineTo(x+s_w*(3/4), y+s_w/4);
          ctx.stroke();
        }
      }
    }
  }

  update(piece, offset) {
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
          debugger;
          this.grid[y+i][x+j] = piece[i][j];
        }
      }
    }
  }




}

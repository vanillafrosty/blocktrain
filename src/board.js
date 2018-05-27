export default class Board {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rows = 24;
    this.cols = 10;
    this.grid = [];
    this.offset = {
      x: 4,
      y: 0
    };
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
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    let s_w = this.square_width;
    for (let i=0; i<this.rows; i++) {
      for (let j=0; j<this.cols; j++) {
        if (typeof(this.grid[i][j]) !== 'undefined') {
          ctx.fillStyle = 'rgb(200,0,0)';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          let x = (this.offset.x+j)*s_w;
          let y = (this.offset.y+i)*s_w;
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





}

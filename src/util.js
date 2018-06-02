export const rightOrLeft = (piece, x) => {
  let middle = Math.floor(piece.length/2);
  return (x < middle ? 'left':'right');
}

export const between = (num, low, high) => {
  if (num < low || num > high) {
    return false;
  } else {
    return true;
  }
}


export const deltaY = (piece, offset, rows, grid) => {
  let minDelta, dy;
  for (let i=0; i<piece.length; i++){
    for (let j=0; j<piece[0].length; j++){
      if (piece[i][j] !== 0) {
        dy = 0;
        while((i+offset.y+dy) < rows && !grid[i+offset.y+dy][j+offset.x]){
          dy += 1;
        }
        if (!minDelta || dy < minDelta) { minDelta = dy; }
      }
    }
  }
  return minDelta;
}

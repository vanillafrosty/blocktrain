# Blocktrain
Javascript OOP implementation of the classic Tetris game in the browser, with a retro aesthetic.

Made in vanilla JS, HTML5, Canvas, and CSS3.

[Play!](http://dwu.space/blocktrain/)

![screenshot](https://i.imgur.com/JczoIMS.png)

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

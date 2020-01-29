// emoji
const EMOJI_FLAG = '🚩';
const EMOJI_MINE = '💣';
const EMOJI_ERROR = '❌';
const EMOJI_WIN = '😎';
const EMOJI_NORMAL = '😃';
const EMOJI_LOSE = '😫';
// settings
var row = 16
var col = 30
var mineCount = 99

// status
var restBlockCount;
var grid;
var isGameStarted;

/** 
 * start or restart a game
 */
function game_init() {
  document.getElementById('grid').innerHTML = function () {
    let gridHtml = '';
    for (let i = 0; i < row; i++) {
      gridHtml += '<tr>';
      for (let j = 0; j < col; j++) {
        gridHtml += '<td><span class="blocks" onmouseup="block_click(' + i + ',' + j + ')"></span></td>';
      }
      gridHtml += '</tr>';
    }
    return gridHtml;
  }();
  restBlockCount = col * row;
  grid = function () {
    let blocks = document.getElementsByClassName('blocks');
    let grid = [];
    for (let i = 0; i < blocks.length; ++i) {
      if (i % col === 0) {
        grid.push([]);
      }
      blocks[i].x = Math.floor(i / col);
      blocks[i].y = i % col;
      blocks[i].isMine = false;
      blocks[i].count = 0;
      block_change_status(blocks[i], 'unopened');
      grid[parseInt(i / col)].push(blocks[i]);
    }
    return grid;
  }();
  document.getElementById('restart').innerHTML = EMOJI_NORMAL;
  isGameStarted = false;
}

/**
 * act when game loses.
 */
function game_lose() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      block_visualize(grid[i][j]);
    }
  }
  document.getElementById('restart').innerHTML = EMOJI_LOSE;
}


/**
 * act when game wins. 
 */
function game_win() {
  document.getElementById('restart').innerHTML = EMOJI_WIN;
}

/**
 * change the status of the block.
 * status are: 'unopened', 'flagged', 'number', 'mine', 'flagged but not mine'.
 */
function block_change_status(block, sta) {
  block.status = sta;
  if (sta === 'unopened') {
    block.style.backgroundColor = "white";
    block.innerHTML = '';
  } else if (sta === 'flagged') {
    block.style.backgroundColor = "white";
    block.innerHTML = EMOJI_FLAG;
  } else if (sta === 'number') {
    block.style.backgroundColor = "silver";
    block.innerHTML = block.count;
  } else if (sta === 'mine') {
    block.style.backgroundColor = "silver";
    block.innerHTML = EMOJI_MINE;
  } else if (sta === 'flagged but not mine') {
    block.style.backgroundColor = "silver";
    block.innerHTML = EMOJI_ERROR;
  } else {
    Error("No such a status!");
  }
}

/**
 * return value: Array.
 * returns all blocks around.
 */
function block_get_neighbor(block) {
  x = block.x;
  y = block.y;
  let direction = [[0, 1], [0, -1], [1, -1], [1, 0], [1, 1], [-1, -1], [-1, 0], [-1, 1]].filter(function (dir_array) {
    return 0 <= x + dir_array[0] && x + dir_array[0] < row && 0 <= y + dir_array[1] && y + dir_array[1] < col;
  });
  return direction.map(function (dir_array) { return grid[x + dir_array[0]][y + dir_array[1]] })
}

function block_visualize(block) {
  if (block.status === 'unopened') {
    if (block.isMine) {
      block_change_status(block, 'mine');
    } else {
      block_change_status(block, 'number');
    }
  } else if (block.status === 'flagged') {
    if (!block.isMine) {
      block_change_status(block, 'flagged but not mine');
    }
  }
}

function block_open(block) {
  if (block.status !== 'unopened') {
    return true;
  }
  block_visualize(block);
  if (block.isMine) {
    return false;
  }
  if (block.count === 0) {
    if (!block_open_around(block)) {
      return false;
    }
  }
  return true;
}

function block_open_around(block) {
  neighbors = block_get_neighbor(block);
  for (let nb of neighbors) {
    if (!block_open(nb)) {
      return false;
    }
  }
  return true;
}
/**
 * act when click the button
 */
function block_click(x, y) {
  let block = grid[x][y];
  if (event.button === 0) { // left button
    if (block.status !== 'unopened') {
      return;
    }
    if (!isGameStarted) {
      game_generate_mine(x, y);
      isGameStarted = true;
    }
    if (!block_open(block)) {
      game_lose();
      return;
    }
  } else if (event.button === 1) { // middle button
    if (block.status === 'unopened') {
      return;
    }
    neighborBlock = block_get_neighbor(block);
    neighborBlock = neighborBlock.filter(function (block) { 
      return block.status === 'flagged'; 
    });
    if (neighborBlock.length === block.count) {
      if (!block_open_around(block)) {
        game_lose();
        return;
      }
    }
  } else if (event.button === 2) { // right button
    if (block.status !== 'unopened') {
      return;
    }
    if (block.status !== 'flagged') {
      block_change_status(block, 'flagged');
    } else {
      block_change_status(block, 'unopened');
    }
  }
  // when game is over.
  if (restBlockCount === mineCount) {
    game_win();
  }
}


/**
 * generate map when first click.
 */
function game_generate_mine(x_ini, y_ini) {
  function randomNum(minNum, maxNum) { return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10); }
  let count = mineCount;
  while (count > 0) {
    let x = randomNum(0, row - 1);
    let y = randomNum(0, col - 1);
    if (!grid[x][y].isMine && (x != x_ini || y != y_ini)) {
      grid[x][y].isMine = true;
      count--;
    }
  }
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i][j].isMine) {
        blocks = block_get_neighbor(grid[i][j]);
        for (let b of blocks) {
          b.count++;
        }
      }
    }
  }
}
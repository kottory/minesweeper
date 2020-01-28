function init_game() {
    document.getElementById('grid').innerHTML = function () {
      let gridHtml = '';
      for (let i = 0; i < row; i++) {
        gridHtml += '<tr>';
        for (let j = 0; j < col; j++) {
          gridHtml += '<td><span class="blocks" onmouseup="block_click(' + i + ',' + j + ',event)"></span></td>';
        }
        gridHtml += '</tr>';
      }
      return gridHtml;
    }();
    restBlockCount = col * row;
    grid = function () {
      let blocks = document.getElementsByClassName('blocks');
      let grid = new Array();
      for (let i = 0; i < blocks.length; ++i) {
        if (i % col === 0) {
          grid.push(new Array());
        }
        blocks[i].isMine = false;
        blocks[i].count = 0;
        blocks[i].isOpen = false;
        blocks[i].innerHTML = '';
        blocks[i].style.backgroundColor = "white";
        document.getElementById('restart').innerHTML = '😃';

        grid[parseInt(i / col)].push(blocks[i]);
      }
      return grid;
    }();
    isGameStarted = false;
    console.log("NMSL1");
  }

  function block_click(x, y, event) {
    console.log("NMSL CLICK NMN");
    function visualize(block) {
      if (block.isOpen) {
        return;
      }
      block.isOpen = true;
      restBlockCount--;
      block.style.backgroundColor = "silver";
      if (block.isMine) {
        if (block.innerHTML != EMOJI_FLAG) {
          block.innerHTML = EMOJI_MINE;
        }
      } else {
        if (block.innerHTML == EMOJI_FLAG) {
          block.innerHTML = EMOJI_ERROR;
        } else {
          block.innerHTML = block.count;
        }
      }
    }
    function open(i, j) {
      // console.log("NMSL OPEN_AROUND NMN");
      if (0 <= i && i < row && 0 <= j && j < col) {
        // console.log("THAT'S NICE");

        if (grid[i][j].isOpen || grid[i][j].innerHTML === EMOJI_FLAG) {
          return;
        }
        visualize(grid[i][j]);
        // console.log("THAT'S RIGHT");
        if (grid[i][j].count != 0) {
          return;
        }
        // console.log("THAT'S GOOD");
        open_around(i, j);
      }
    }
    function open_around(i, j) {
      open(i + 1, j);
      open(i + 1, j - 1);
      open(i + 1, j + 1);
      open(i, j - 1);
      open(i, j + 1);
      open(i - 1, j);
      open(i - 1, j - 1);
      open(i - 1, j + 1);
    }

    let block = grid[x][y];

    if (event.button === 0) {
      if (block.isOpen) {
        return;
      }
      if (!isGameStarted) {
        spawn_mine(x, y);
        isGameStarted = true;
      }
      if (block.isMine) {
        // open all
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < col; j++) {
            visualize(grid[i][j]);
            document.getElementById('restart').innerHTML = '😫';
          }
        }
      } else {
        open(x, y);
      }
    } else if (event.button === 1) {
      if (!block.isOpen) {
        return;
      }
      console.log("MIDDLE NMSL");
      function is_flag(i, j) {
        if (0 <= i && i < row && 0 <= j && j < col) {
          return grid[i][j].innerHTML === EMOJI_FLAG;
        }
      }
      let cnt = 0;
      if (is_flag(x + 1, y)) {
        cnt++;
      }
      if (is_flag(x + 1, y - 1)) {
        cnt++;
      }
      if (is_flag(x + 1, y + 1)) {
        cnt++;
      }
      if (is_flag(x, y - 1)) {
        cnt++;
      }
      if (is_flag(x, y + 1)) {
        cnt++;
      }
      if (is_flag(x - 1, y)) {
        cnt++;
      }
      if (is_flag(x - 1, y - 1)) {
        cnt++;
      }
      if (is_flag(x - 1, y + 1)) {
        cnt++;
      }
      console.log(cnt + " NMSL");
      if (cnt === block.count) {
        open_around(x, y);
      }
    } else if (event.button === 2) {
      if (block.isOpen) {
        return;
      }
      if (block.innerHTML !== EMOJI_FLAG) {
        block.innerHTML = EMOJI_FLAG;
      } else {
        block.innerHTML = '';
      }
    }
    if (restBlockCount === mineCount) {
      document.getElementById('restart').innerHTML = '😎';

    }
  }

  function spawn_mine(x_ini, y_ini) {
    function randomNum(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
    let count = mineCount;
    while (count > 0) {
      let x = randomNum(0, row - 1);
      let y = randomNum(0, col - 1);
      if (grid[x][y].isMine || (x == x_ini && y == y_ini)) {
        continue;
      } else {
        grid[x][y].isMine = true;
        count--;
      }
    }
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        function add(i, j) {
          if (0 <= i && i < row && 0 <= j && j < col) {
            grid[i][j].count++;
          }
        }

        if (grid[i][j].isMine) {
          add(i + 1, j);
          add(i + 1, j - 1);
          add(i + 1, j + 1);
          add(i, j - 1);
          add(i, j + 1);
          add(i - 1, j);
          add(i - 1, j - 1);
          add(i - 1, j + 1);
        }
      }
    }
  }
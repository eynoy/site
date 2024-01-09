const findLeastDistIndex = (tileArr) => {
  let leastIndex = 0;
  for (let i = 1; i < tileArr.length; i++) {
    if (tileArr[i].dist < tileArr[leastIndex].dist) {
      leastIndex = i;
    }
  }
  return leastIndex;
};

const indexOfPos = (pos, tileArr) => {
  for (let i = 0; i < tileArr.length; i++) {
    if (tileArr[i].pos.equals(pos)) {
      return i;
    }
  }
  return null;
};

const tileSize = 25;
const halfTileSize = tileSize/2;
const buffer = 5;
const totalSize = tileSize + buffer;

const board = {
  width: 0,
  height: 0,
  wait: 0,
  addMode: true,
  startTile: new Point(0, 0),
  endTile: new Point(0, 0),
  currentTile: new Tile(0, 0),
  getTile: function(x, y) {
    if (x >= 0 && x < this.tileCols && y >= 0 && y < this.tileRows) {
      return this.tiles[y][x];
    }
    return null;
  },
  setup: function() {
    this.width = drawScreen.canvas.width/2 - buffer;
    this.height = drawScreen.canvas.height/2 - buffer;

    this.tileCols = Math.floor(this.width / totalSize);
    this.tileRows = Math.floor(this.height / totalSize);
    this.maxDist = this.tileCols * this.tileRows / 8;

    // this.endTile.x = this.tileCols - 1;
    // this.endTile.y = this.tileRows - 1;

    this.startTile.x = Math.floor(this.tileCols / 4) + 1;
    this.endTile.x = Math.floor(this.tileCols * 3 / 4) + 1;
    this.startTile.y = this.endTile.y = Math.floor(this.tileRows / 2) - 1;

    this.tiles = new Array(this.tileRows);
    for (let i = 0; i < this.tileRows; i++) this.tiles[i] = new Array(this.tileCols);

    for (let i = 0; i < this.tileRows; i++) {
      for (let j = 0; j < this.tileCols; j++) {
        this.tiles[i][j] = new Tile(j, i);
      }
    }
  },
  algoStep: 0,
  reset: function() {
    this.wait = 0;
    for (let i = 0; i < this.tileRows * this.tileCols; i++) {
      const posY = Math.floor(i / this.tileCols);
      const posX = Math.floor(i % this.tileCols);

      this.tiles[posY][posX].dist = Infinity;
      this.tiles[posY][posX].isPath = false;
      this.tiles[posY][posX].prev = null;
      this.tiles[posY][posX].foundStep = 0;
      this.tiles[posY][posX].foundDir = 0;

      if (this.tiles[posY][posX].pos.equals(this.startTile)) {
        this.tiles[posY][posX].dist = 0;
        this.tiles[posY][posX].isBlock = false;
      }
    }
    this.getTile(this.endTile.x, this.endTile.y).isBlock = false;
  },
  clear: function() {
    for (let i = 0; i < this.tileRows * this.tileCols; i++) {
        const posY = Math.floor(i / this.tileCols);
        const posX = Math.floor(i % this.tileCols);

        this.tiles[posY][posX].isBlock = false;
    } 
  },
  findFinalPath: function() {
    if (this.wait < 19) this.wait++;
    else if (this.wait === 19) {
      this.wait++;
    }
    else if (this.currentTile.prev != null) {
      this.currentTile.isPath = true;
      this.currentTile.foundStep = 0;
      if (this.currentTile.pos.equals(this.endTile)) this.currentTile.foundStep = halfTileSize;

      if (this.currentTile.pos.x == this.currentTile.prev.pos.x) {
        if (this.currentTile.pos.y > this.currentTile.prev.pos.y) {
          this.currentTile.foundDir = 1; //North
        }
        else {
          this.currentTile.foundDir = 2; //South
        }
      }
      else {
        if (this.currentTile.pos.x > this.currentTile.prev.pos.x) {
          this.currentTile.foundDir = 3; //West
        }
        else {
          this.currentTile.foundDir = 4; //East
        }
      }

      this.currentTile = this.currentTile.prev;
    }
    else {
      this.algoStep = 0;
      algoType = 0;
    }
  },
  dijkstras: function() {
    switch (this.algoStep) {
      case 0:
        this.unvisitedSet = new Array();

        for (let i = 0; i < this.tileRows * this.tileCols; i++) {
          const posY = Math.floor(i / this.tileCols);
          const posX = Math.floor(i % this.tileCols);

          this.tiles[posY][posX].dist = Infinity;
          this.tiles[posY][posX].isPath = false;
          this.tiles[posY][posX].prev = null;
          this.tiles[posY][posX].foundStep = 0;
          this.tiles[posY][posX].foundDir = 0;

          if (this.tiles[posY][posX].pos.equals(this.startTile)) {
            this.tiles[posY][posX].dist = 0;
            this.tiles[posY][posX].isBlock = false;
          }
          if (!this.tiles[posY][posX].isBlock) this.unvisitedSet.push(this.tiles[posY][posX]);
        }

        this.algoStep++;
        break;
      case 1:
        if (!this.unvisitedSet.empty() &&
          (algoType !== 2 || this.currentTile !== this.tiles[this.endTile.y][this.endTile.x])) {
          const currentIndex = findLeastDistIndex(this.unvisitedSet);
          this.currentTile = this.unvisitedSet.splice(currentIndex, 1)[0]; //find least distance in set

          const neighborArr = new Array();
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i == 0 || j == 0) neighborArr.push(indexOfPos(this.currentTile.pos.add(i, j), this.unvisitedSet));
            }
          }

          for (let i = 0; i < 5; i++) {
            if (neighborArr[i] != null) {
              const alt = this.currentTile.dist + this.currentTile.pos.dist(this.unvisitedSet[neighborArr[i]].pos);

              if (alt < this.unvisitedSet[neighborArr[i]].dist) {
                this.unvisitedSet[neighborArr[i]].dist = alt;
                this.unvisitedSet[neighborArr[i]].prev = this.currentTile;
              }
            }
          }
        }
        else {
          this.algoStep++;
          this.currentTile = this.tiles[this.endTile.y][this.endTile.x];
        }
        break;
      case 2:
        this.findFinalPath();
        break;
    }
  },
  a_star: function() {
    switch (this.algoStep) {
      case 0:
        this.unvisitedSet = new Array();
        this.heuristic = (aT, bT) => aT.pos.dist(bT.pos);

        for (let i = 0; i < this.tileRows * this.tileCols; i++) {
          const posY = Math.floor(i / this.tileCols);
          const posX = Math.floor(i % this.tileCols);

          this.tiles[posY][posX].dist = Infinity;
          this.tiles[posY][posX].local = Infinity;
          this.tiles[posY][posX].isPath = false;
          this.tiles[posY][posX].visited = false;
          this.tiles[posY][posX].prev = null;
          this.tiles[posY][posX].foundStep = 0;
          this.tiles[posY][posX].foundDir = 0;

          if (this.tiles[posY][posX].pos.equals(this.startTile)) {
            this.tiles[posY][posX].dist = 0;
            this.tiles[posY][posX].isBlock = false;
          }

          this.tiles[posY][posX].neighbors = new Array();
          if (posY - 1 >= 0)
            this.tiles[posY][posX].neighbors.push(this.tiles[posY-1][posX]);
          if (posX - 1 >= 0)
            this.tiles[posY][posX].neighbors.push(this.tiles[posY][posX-1]);
          if (posY + 1 < this.tileRows)
            this.tiles[posY][posX].neighbors.push(this.tiles[posY+1][posX]);
          if (posX + 1 < this.tileCols)
            this.tiles[posY][posX].neighbors.push(this.tiles[posY][posX+1]);
        }
        this.algoStep++;

        this.tiles[this.startTile.y][this.startTile.x].local = 0;
        this.tiles[this.startTile.y][this.startTile.x].dist = this.heuristic(this.tiles[this.startTile.y][this.startTile.x], this.tiles[this.endTile.y][this.endTile.x]);
        this.unvisitedSet.push(this.tiles[this.startTile.y][this.startTile.x]);
        break;
      case 1:
        if (!this.unvisitedSet.empty() &&
           (algoType !== 4 || this.currentTile !== this.tiles[this.endTile.y][this.endTile.x])) {
          
          this.unvisitedSet.sort((tA, tB) => {
            if (tA.dist < tB.dist) return -1;
            if (tA.dist > tB.dist) return 1;
            return 0;
          });

          while(!this.unvisitedSet.empty() && this.unvisitedSet.front().visited) {
				    this.unvisitedSet.shift();
          }
			
          if (this.unvisitedSet.empty()) {
            this.algoStep++;
            this.currentTile = this.tiles[this.endTile.y][this.endTile.x];
            return;
          }
          
          this.currentTile = this.unvisitedSet.front();
          this.currentTile.visited = true;
          for (let neighbour of this.currentTile.neighbors) {
            if (!neighbour.visited && !neighbour.isBlock) {
              this.unvisitedSet.push(neighbour);
            }
            
            let possibleLowerGoal = this.currentTile.local + this.currentTile.pos.dist(neighbour.pos);

            if (possibleLowerGoal < neighbour.local) {
              neighbour.prev = this.currentTile;
              neighbour.local = possibleLowerGoal;
              neighbour.dist = neighbour.local + this.heuristic(neighbour, this.tiles[this.endTile.y][this.endTile.x]);
            }
          }
        }
        else {
          this.algoStep++;
          this.currentTile = this.tiles[this.endTile.y][this.endTile.x];
        }
        break;
      case 2:
        this.findFinalPath();
        break;
    }
  },
  stack: [],
  beginMaze: function() {
    this.reset();

    for (let i = -1; i < this.tileRows; i += 2) {
      for (let j = -1; j < this.tileCols; j += 2) {
        if (this.getTile(j, i)) {
          this.getTile(j, i).isBlock = true;
        }
        if (this.getTile(j + 1, i)) {
          this.getTile(j + 1, i).isBlock = true;
        }
        if (this.getTile(j, i + 1)) {
          this.getTile(j, i + 1).isBlock = true;
        }
        if (this.getTile(j + 1, i + 1)) {
          this.getTile(j + 1, i + 1).isBlock = false;
        }
      }
    }

    const beginGenPos = new Point(Math.floor(this.tileCols / 2) % 2 === 0 ? Math.floor(this.tileCols / 2) : Math.floor(this.tileCols / 2) + 1, Math.floor(this.tileRows / 2) % 2 === 0 ? Math.floor(this.tileRows / 2) : Math.floor(this.tileRows / 2) + 1);

    this.tiles[beginGenPos.y][beginGenPos.x].isPath = true; //mark as visited
    if (mazeAlgo === 1) {
      this.stack.push(this.tiles[beginGenPos.y][beginGenPos.x]);
    }
    else if (mazeAlgo === 2) {
      const currentTile = this.tiles[beginGenPos.y][beginGenPos.x];
      currentTile.isPath = true;
      
      //This is the neighbor wall stack
      this.stack.push(this.getTile(currentTile.pos.x+1, currentTile.pos.y));
      this.stack.push(this.getTile(currentTile.pos.x-1, currentTile.pos.y));
      this.stack.push(this.getTile(currentTile.pos.x, currentTile.pos.y+1));
      this.stack.push(this.getTile(currentTile.pos.x, currentTile.pos.y-1));
    }
  },
  depthSearch: function() {
    if (!this.stack.empty()) {
      const currentCell = this.stack.pop();

      for (let i = 1; i < this.stack.length; i++) {
        let prevCell = this.stack[i - 1];
        let cell = this.stack[i];

        drawScreen.ctx.fillStyle = "Cyan";
        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(buffer + cell.pos.x * (tileSize + buffer) + halfTileSize, buffer + cell.pos.y * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
        drawScreen.ctx.fill();

        drawScreen.ctx.strokeStyle = "Cyan";
        drawScreen.drawLine(buffer + cell.pos.x * (tileSize + buffer) + halfTileSize, buffer + cell.pos.y * (tileSize + buffer) + halfTileSize, buffer + prevCell.pos.x * (tileSize + buffer) + halfTileSize, buffer + prevCell.pos.y * (tileSize + buffer) + halfTileSize);
      }

      drawScreen.ctx.fillStyle = "Purple";
      drawScreen.ctx.beginPath();
      drawScreen.ctx.arc(buffer + currentCell.pos.x * (tileSize + buffer) + halfTileSize, buffer + currentCell.pos.y * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
      drawScreen.ctx.fill();

      if ((this.getTile(currentCell.pos.x, currentCell.pos.y - 2) && !this.getTile(currentCell.pos.x, currentCell.pos.y - 2).isPath)
      ||  (this.getTile(currentCell.pos.x, currentCell.pos.y + 2) && !this.getTile(currentCell.pos.x, currentCell.pos.y + 2).isPath)
      ||  (this.getTile(currentCell.pos.x - 2, currentCell.pos.y) && !this.getTile(currentCell.pos.x - 2, currentCell.pos.y).isPath)
      ||  (this.getTile(currentCell.pos.x + 2, currentCell.pos.y) && !this.getTile(currentCell.pos.x + 2, currentCell.pos.y).isPath)) {
        this.stack.push(currentCell);
        
        let neighbour = null;
        while (neighbour === null) {
          const roll = getRandomInt(4); //0, 1, 2, 3
          switch (roll) {
            case 0: //Up
              neighbour = this.getTile(currentCell.pos.x, currentCell.pos.y - 2);
              if (neighbour && !neighbour.isPath && this.getTile(currentCell.pos.x, currentCell.pos.y - 1)) {
                this.getTile(currentCell.pos.x, currentCell.pos.y - 1).isBlock = false;
                this.getTile(currentCell.pos.x, currentCell.pos.y - 1).isPath = true;
              }
              else neighbour = null;
              break;
            case 1: //Down
              neighbour = this.getTile(currentCell.pos.x, currentCell.pos.y + 2);
              if (neighbour && !neighbour.isPath && this.getTile(currentCell.pos.x, currentCell.pos.y + 1)) {
                this.getTile(currentCell.pos.x, currentCell.pos.y + 1).isBlock = false;
                this.getTile(currentCell.pos.x, currentCell.pos.y + 1).isPath = true;
              }
              else neighbour = null;
              break;
            case 2: //Left
              neighbour = this.getTile(currentCell.pos.x - 2, currentCell.pos.y);
              if (neighbour && !neighbour.isPath && this.getTile(currentCell.pos.x - 1, currentCell.pos.y)) {
                this.getTile(currentCell.pos.x - 1, currentCell.pos.y).isBlock = false;
                this.getTile(currentCell.pos.x - 1, currentCell.pos.y).isPath = true;
              }
              else neighbour = null;
              break;
            case 3: //Right
              neighbour = this.getTile(currentCell.pos.x + 2, currentCell.pos.y);
              if (neighbour && !neighbour.isPath && this.getTile(currentCell.pos.x + 1, currentCell.pos.y)) {
                this.getTile(currentCell.pos.x + 1, currentCell.pos.y).isBlock = false;
                this.getTile(currentCell.pos.x + 1, currentCell.pos.y).isPath = true;
              }
              else neighbour = null;
              break;
          }
        }
        neighbour.isPath = true;
        this.stack.push(neighbour);
      }
      return false;
    }
    else {
      // this.tiles[0][1].isBlock = false;
      // this.tiles[1][0].isBlock = false;
      // this.tiles[1][1].isBlock = false;
      this.tiles[this.tileRows - 2][this.tileCols - 1].isBlock = false;
      this.reset();
      this.stack.length = 0;
      algoType = 0;
      return true;
    }
  },
  prims: function() {
    if (!this.stack.empty()) {
      for (let i = 1; i < this.stack.length; i++) {
        const cell = this.stack[i];

        drawScreen.ctx.fillStyle = "Cyan";
        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(buffer + cell.pos.x * (tileSize + buffer) + halfTileSize, buffer + cell.pos.y * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
        drawScreen.ctx.fill();
      }

      let stillErasing = true;
      while (stillErasing) {
        const index = getRandomInt(this.stack.length);
        const currentWall = this.stack[index];

        drawScreen.ctx.fillStyle = "Purple";
        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(buffer + currentWall.pos.x * (tileSize + buffer) + halfTileSize, buffer + currentWall.pos.y * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
        drawScreen.ctx.fill();

        if (currentWall.onlyOneNeighCellIsVisited()) {
          currentWall.isBlock = false;
          currentWall.isPath = true;
          currentWall.neighbours().forEach(n => {
            n.isPath = true;
            Array.prototype.push.apply(this.stack, n.neighbours());
          });
          this.stack.splice(index, 1)
          
          stillErasing = false;
        }
        else {
          this.stack.splice(index, 1)
        }
      }

      return false;
    }
    this.reset();
    this.stack.length = 0;
    algoType = 0;
    return true;
  },
  draw: function() {
    for (let i = 0; i < this.tileRows; i++) {
      for (let j = 0; j < this.tileCols; j++) {
        if (board.startTile.equal(j, i)) {
          drawScreen.ctx.fillStyle = "Green";
          drawScreen.ctx.beginPath();
          drawScreen.ctx.arc(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
          drawScreen.ctx.fill();
        }
        else if (board.endTile.equal(j, i)) {
          drawScreen.ctx.fillStyle = "Red";
          drawScreen.ctx.beginPath();
          drawScreen.ctx.arc(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
          drawScreen.ctx.fill();
        }
        else if (this.tiles[i][j].isBlock) {
          drawScreen.ctx.fillStyle = "Black";
          drawScreen.ctx.beginPath();
          drawScreen.ctx.arc(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
          drawScreen.ctx.fill();
        }
        else if (this.tiles[i][j].isPath) {
          drawScreen.ctx.fillStyle = "Grey";
          drawScreen.ctx.beginPath();
          if (this.tiles[i][j].foundStep < halfTileSize) {
            drawScreen.ctx.arc(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, this.tiles[i][j].foundStep, 0, 2 * Math.PI, false);
            this.tiles[i][j].foundStep += 2;
          }
          else {
            drawScreen.ctx.arc(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
          }
          drawScreen.ctx.fill();
        }
        else if (this.tiles[i][j].dist < Infinity) {
          drawScreen.ctx.fillStyle = "rgb(" + ((this.tiles[i][j].dist * 200 / this.maxDist + 55)) + ", " + (255 - (this.tiles[i][j].dist * 72 / this.maxDist + 55)) + ", " + (this.tiles[i][j].dist * 25 / this.maxDist + 55) + ")";
          drawScreen.ctx.beginPath();
          if (this.tiles[i][j].foundStep < halfTileSize) {
            drawScreen.ctx.arc(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, this.tiles[i][j].foundStep, 0, 2 * Math.PI, false);
            this.tiles[i][j].foundStep += 1;
          }
          else {
            drawScreen.ctx.arc(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
          }
          drawScreen.ctx.fill();
        }


        drawScreen.ctx.strokeStyle = "Black";
        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, halfTileSize, 0, 2 * Math.PI, false);
        drawScreen.ctx.stroke();
      }
    }
    for (let i = 0; i < this.tileRows; i++) {
      for (let j = 0; j < this.tileCols; j++) {
        if (this.tiles[i][j].foundStep >= halfTileSize && this.tiles[i][j].prev && this.tiles[i][j].foundDir) {
            drawScreen.ctx.strokeStyle = "Grey";
            switch (this.tiles[i][j].foundDir) {
              case 1: //North
                drawScreen.drawLine(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, buffer + j * (tileSize + buffer) + halfTileSize, buffer + (i-1) * (tileSize + buffer) + halfTileSize);
                break;
              case 2: //South
                drawScreen.drawLine(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, buffer + j * (tileSize + buffer) + halfTileSize, buffer + (i+1) * (tileSize + buffer) + halfTileSize);
                break;
              case 3: //West
                drawScreen.drawLine(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, buffer + (j-1) * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize);
                break;
              case 4: //East
                drawScreen.drawLine(buffer + j * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize, buffer + (j+1) * (tileSize + buffer) + halfTileSize, buffer + i * (tileSize + buffer) + halfTileSize);
                break;
            }
            drawScreen.ctx.strokeStyle = "Black";
        }
      }
    }
  }
};
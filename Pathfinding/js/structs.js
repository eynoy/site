class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  equals(other) {
    return this.x == other.x && this.y == other.y;
  }
  equal(x, y) {
    return this.x == x && this.y == y;
  }
  dist(other) {
    return Math.sqrt(((this.x - other.x) * (this.x - other.x)) + ((this.y - other.y) * (this.y - other.y)));
  }
  add(x, y) {
    return new Point(this.x + x, this.y + y);
  }
}

class Tile {
  constructor(x, y) {
    this.pos = new Point(x, y);
    this.isBlock = false;
    this.dist = Infinity;
    //Djikstras
    this.prev = null;
    this.isPath = false;
    this.foundStep = 0;
    this.foundDir = 0;
    //A*
    this.local = 0;
    this.neighbors = null;
    this.visited = false;
  }
  top() {
    if (board.getTile(this.pos.x, this.pos.y - 1)) return board.getTile(this.pos.x, this.pos.y - 1).isBlock;
    return true;
  }
  bottom() {
    if (board.getTile(this.pos.x, this.pos.y + 1)) return board.getTile(this.pos.x, this.pos.y + 1).isBlock;
    return true;
  }
  left() {
    if (board.getTile(this.pos.x - 1, this.pos.y)) return board.getTile(this.pos.x - 1, this.pos.y).isBlock;
    return true;
  }
  right() {
    if (board.getTile(this.pos.x + 1, this.pos.y)) return board.getTile(this.pos.x + 1, this.pos.y).isBlock;
    return true;
  }
  neighbours() {
    if (this.pos.x % 2 === 1) {
      if (this.pos.y % 2 === 1) {
        console.log("Unknown Case of inner wall??");
        return [];
      }

      //x odd y even => horizontal
      return [board.getTile(this.pos.x + 1, this.pos.y), board.getTile(this.pos.x - 1, this.pos.y)];
    }
    
    if (this.pos.y % 2 === 0) {
      const returnArr = [];
      if (this.pos.y < board.tileRows - 1 && this.bottom()) returnArr.push(board.getTile(this.pos.x, this.pos.y + 1));
      if (this.pos.y > 0 && this.top()) returnArr.push(board.getTile(this.pos.x, this.pos.y - 1));
      if (this.pos.x < board.tileCols - 1 && this.right()) returnArr.push(board.getTile(this.pos.x + 1, this.pos.y));
      if (this.pos.x > 0 && this.left()) returnArr.push(board.getTile(this.pos.x - 1, this.pos.y));
      return returnArr;
    }

    //x even y odd => vertical
    if (this.pos.y === board.tileRows - 1 && board.tileRows % 2 === 0) return [board.getTile(this.pos.x, this.pos.y - 1), board.getTile(this.pos.x, this.pos.y - 1)];
    return [board.getTile(this.pos.x, this.pos.y + 1), board.getTile(this.pos.x, this.pos.y - 1)];
  }
  onlyOneNeighCellIsVisited() {
    const nArr = this.neighbours();
    return (!nArr[0].isPath && nArr[1].isPath) || (nArr[0].isPath && !nArr[1].isPath);

  }
}
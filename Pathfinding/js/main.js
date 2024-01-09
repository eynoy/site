let constructingMaze = false;

let algoType = 0;
let mazeAlgo = 0;

const mainLoop = () => {
  drawScreen.clear();

  board.draw();

  if (constructingMaze) {
    switch (mazeAlgo) {
      case 1: //depth-first
        if (board.depthSearch()) constructingMaze = false;
        break;
      case 2: //prims
        if (board.prims()) constructingMaze = false;
        break;
    }
  }
  else {
    switch (algoType) {
      case 2: //djikstras fast
      case 1: //djikstras full
        board.dijkstras();
        if (board.algoStep === 1) for (let i = 0; i < 8; i++) board.dijkstras();
        else if (board.algoStep === 2) for (let i = 0; i < 2; i++) if (board.algoStep === 2) board.dijkstras();
        break;
      case 4: //A* fast
      case 3: //A* full
        board.a_star();
        if (board.algoStep === 1) for (let i = 0; i < 8; i++) board.a_star();
        else if (board.algoStep === 2) for (let i = 0; i < 2; i++) if (board.algoStep === 2) board.a_star();
        break;
    }
  }
};
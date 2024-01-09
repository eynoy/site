class Fruit {
  constructor(gridx, gridy) {
    this.gridPos = new Vector2D(gridx, gridy);
    this.mesh = new Mesh(boxVertices, textures.FRUIT, vec3.fromValues((this.gridPos.x-0.5) * gridSize, 2, (this.gridPos.y-0.5) * gridSize), 1.5);
    //this.mesh.recolor(1, 0, 0);
  }
  updateGridPos(newCoords) {
    this.gridPos = newCoords;
    this.mesh = new Mesh(boxVertices, textures.FRUIT, vec3.fromValues((this.gridPos.x-0.5) * gridSize, 2, (this.gridPos.y-0.5) * gridSize), 1.5);
    //this.mesh.recolor(1, 0, 0);
  }
  update() {
    meshes.loadMesh(this.mesh);
  }
  getEaten() {
    const c = new Vector2D(Math.floor(Math.random() * 20 - 9), Math.floor(Math.random() * 20 - 9));
    while (player.hasSegOn(c)) {
      c.x = Math.floor(Math.random() * 20 - 9);
      c.y = Math.floor(Math.random() * 20 - 9);
    }
    this.updateGridPos(c);
  }
}

class Fruit3D {
  constructor(gridx, gridy, gridz) {
    this.gridPos = new Vector3D(gridx, gridy, gridz);
    this.mesh = new Mesh(boxVertices, textures.FRUIT, vec3.fromValues((this.gridPos.x-0.5) * gridSize, (this.gridPos.y-0.5) * gridSize, (this.gridPos.z-0.5) * gridSize), 1.5);
  }
  updateGridPos(newCoords) {
    this.gridPos = newCoords;
    this.mesh = new Mesh(boxVertices, textures.FRUIT, vec3.fromValues((this.gridPos.x-0.5) * gridSize, (this.gridPos.y-0.5) * gridSize, (this.gridPos.z-0.5) * gridSize), 1.5);
  }
  update() {
    meshes.loadMesh(this.mesh);
  }
  getEaten() {
    const c = new Vector3D(Math.floor(Math.random() * 20 - 9), Math.floor(Math.random() * 20 - 9), Math.floor(Math.random() * 20 - 9));
    while (player.hasSegOn(c)) {
      c.x = Math.floor(Math.random() * 20 - 9);
      c.y = Math.floor(Math.random() * 20 - 9);
      c.z = Math.floor(Math.random() * 20 - 9);
    }
    this.updateGridPos(c);
  }
}

class LoopFruit {
  constructor() {
    this.gridPos = new Vector3D(8, 0, 8);

    this.loaded = false;
    this.img = new Image();
    this.img.onload = () => this.loaded = true;
    this.img.src = "resources/apple.png";
  }
  updateGridPos(newCoords) {
    this.gridPos = newCoords;
  }
  draw(ctx) {
    if (!this.loaded) {
      ctx.fillStyle = "Orange";
      ctx.fillRect(this.gridPos.x * 12.8 + 6, this.gridPos.z * 12.8 + 6, 14, 14);
    }
    else {
      ctx.drawImage(this.img, this.gridPos.x * 12.8 + 6, this.gridPos.z * 12.8 + 6, 14, 14);
    }
  }
  getEaten() {
    const c = new Vector3D(Math.floor(Math.random() * 10) * 2,
                           Math.floor(Math.random() * 6),
                           Math.floor(Math.random() * 10) * 2);
    while (player.hasSegOn(c)) {
      c.x = Math.floor(Math.random() * 10) * 2;
      c.y = Math.floor(Math.random() * 6);
      c.z = Math.floor(Math.random() * 10) * 2;
    }
    this.updateGridPos(c);
  }
}
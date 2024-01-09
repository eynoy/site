const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

const width = 70;
const height = 50;

let simplex = new SimplexNoise();
const genNewMap = () => {
  simplex = new SimplexNoise();
  recalculateMesh();
};

let haveWireframe = false;
let haveLighting = true;

let gl;

const getVertexBlack = (vertices, i) => {
  return [vertices[i * 9], vertices[i * 9 + 1], vertices[i * 9 + 2], 0, 0, 0, 0, 0, 0];
};

const TrianglesToWireframe = (vertices) => {
	const retArr = [];

  for (let i = 0; i < vertices.length/27; i++) {
    retArr.push.apply(retArr, getVertexBlack(vertices, i * 3));
    retArr.push.apply(retArr, getVertexBlack(vertices, (i * 3) + 1));

    retArr.push.apply(retArr, getVertexBlack(vertices, (i * 3) + 1));
    retArr.push.apply(retArr, getVertexBlack(vertices, (i * 3) + 2));

    retArr.push.apply(retArr, getVertexBlack(vertices, (i * 3) + 2));
    retArr.push.apply(retArr, getVertexBlack(vertices, i * 3));
  }

	return retArr;
};

const player = {
  pos: vec3.fromValues(-70, -70, 60),
  vel: vec3.create(),
  canMove: true
};

const colorsFromHeight = (h) => {
  if (h < -0.4) { //water
    return [0.612, 0.828, 0.859];
  }
  else if (h < 0.0) { //sand
    return [0.859, 0.820, 0.706];
  }
  else if (h < 0.5) { //mountain
    return [0.882, 0.663, 0.373];
  }
  return [1, 1, 1];
};

document.body.addEventListener("keyup", (e) => {
  if (e.keyCode == 87 || e.keyCode == 83) { //forward
    player.vel[2] = 0;
  }
  else if (e.keyCode == 65 || e.keyCode == 68) { //left
    player.vel[0] = 0;
  }
  else if (e.keyCode == 32 || e.keyCode == 16) { //up
    player.vel[1] = 0;
  }
});

document.body.addEventListener("keydown", (e) => {
  if (player.canMove) {
    if (e.keyCode == 87) { //forward
      player.vel[2] = -0.1;
    }
    else if (e.keyCode == 83) { //backward
      player.vel[2] = 0.1;
    }
    else if (e.keyCode == 65) { //left
      player.vel[0] = -0.1;
    }
    else if (e.keyCode == 68) { //righ
      player.vel[0] = 0.1;
    }
    else if (e.keyCode == 32) { //up
      player.vel[1] = -0.1;
    }
    else if (e.keyCode == 16) { //down
      player.vel[1] = 0.1;
    }
  }
});

let boxVertices = [];

let heighting = 10;
let noiseDetail = 0.08;
let noiseOffsetZ = 0;
const spacing = 2;

let boxVertexBufferObject;

const recalculateMesh = () => {
  boxVertices.length = 0; //Clear
  for (let i = 0; i < height - 1; i++) { //z
    for (let j = 0; j < width - 1; j++) { //x
      const height = simplex.noise2D(j * noiseDetail, i * noiseDetail + noiseOffsetZ); //-1 to 1
      const height1 = simplex.noise2D((j+1) * noiseDetail, i * noiseDetail + noiseOffsetZ); //-1 to 1
      const height2 = simplex.noise2D(j * noiseDetail, (i+1) * noiseDetail + noiseOffsetZ); //-1 to 1
      const height3 = simplex.noise2D((j+1) * noiseDetail, (i+1) * noiseDetail + noiseOffsetZ); //-1 to 1

      i *= spacing;
      j *= spacing;

      //TRIANGLE 1
      const tricolor1 = colorsFromHeight((height + height2 + height1) / 3);

      let normals1 = vec3.fromValues(0, 1, 0);
      if (haveLighting) vec3.cross(normals1, vec3.fromValues(0, heighting * (height2 - height), spacing), vec3.fromValues(-spacing, heighting * (height2 - height1), spacing));
      vec3.normalize(normals1, normals1);

      boxVertices.push(j, heighting * height, i);
      boxVertices.push(normals1[0], normals1[1], normals1[2]);
      boxVertices.push.apply(boxVertices, tricolor1);

      boxVertices.push(j, heighting * height2, i+spacing);
      boxVertices.push(normals1[0], normals1[1], normals1[2]);
      boxVertices.push.apply(boxVertices, tricolor1);

      boxVertices.push(j+spacing, heighting * height1, i);
      boxVertices.push(normals1[0], normals1[1], normals1[2]);
      boxVertices.push.apply(boxVertices, tricolor1);

      //TRIANGLE 2
      const tricolor2 = colorsFromHeight((height1 + height2 + height3) / 3);

      let normals2 = vec3.fromValues(0, 1, 0);
      if (haveLighting) vec3.cross(normals2, vec3.fromValues(-spacing, heighting * height2 - heighting * height1, spacing), vec3.fromValues(-spacing, heighting * height2 - heighting * height3, 0));
      vec3.normalize(normals2, normals2);

      boxVertices.push(j+spacing, heighting * height1, i);
      boxVertices.push(normals2[0], normals2[1], normals2[2]);
      boxVertices.push.apply(boxVertices, tricolor2);

      boxVertices.push(j, heighting * height2, i+spacing);
      boxVertices.push(normals2[0], normals2[1], normals2[2]);
      boxVertices.push.apply(boxVertices, tricolor2);
      
      boxVertices.push(j+spacing, heighting * height3, i+spacing);
      boxVertices.push(normals2[0], normals2[1], normals2[2]);
      boxVertices.push.apply(boxVertices, tricolor2);

      i /= spacing;
      j /= spacing;
    }
  }

  if (haveWireframe) boxVertices = boxVertices.concat(TrianglesToWireframe(boxVertices));
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
};

document.getElementById("noiseDetail").addEventListener("input", (e) => {
  noiseDetail = parseFloat(e.srcElement.value);
  document.getElementById("noiseDetailVal").innerText = noiseDetail;
  if (player.canMove) recalculateMesh();
});

document.getElementById("heighting").addEventListener("input", (e) => {
  heighting = parseFloat(e.srcElement.value);
  document.getElementById("heightingVal").innerText = heighting;
  if (player.canMove) recalculateMesh();
});

document.getElementById("wireframe").addEventListener("input", (e) => {
  haveWireframe = !haveWireframe;
  if (player.canMove) recalculateMesh();
});

document.getElementById("lighting").addEventListener("input", (e) => {
  haveLighting = !haveLighting;
  if (player.canMove) recalculateMesh();
});

document.getElementById("travel").addEventListener("input", (e) => {
  player.canMove = !player.canMove;
  player.pos[0] = -70;
  player.pos[1] = -21;
  player.pos[2] = -4;
});

const vertexShaderText = [
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'attribute vec3 vertNormal;',
'varying vec3 fragColor;',
'varying vec3 fragNormal;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main() {',
'  fragColor = vertColor;',
'  fragNormal = abs(vertNormal);',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

const fragmentShaderText = [
'precision mediump float;',
'',
'varying vec3 fragColor;',
'varying vec3 fragNormal;',
'void main() {',
'  float percentFacingUp = dot(fragNormal, vec3(0, 1, 0));',
'  gl_FragColor = vec4(percentFacingUp * fragColor, 1.0);',
'}'
].join('\n');

const InitDemo = function() {
  console.log('This is working');

  const canvas = document.getElementById('game-surface');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl = canvas.getContext('webgl');

  if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert('Your browser does not support WebGL');
    return
  }

  //
  // Create shaders
  // 
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //Basic settings
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);
  
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }
  
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    return;
  }

  boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  recalculateMesh();

  const boxSize = (height-1) * (width-1) * 6;

  // for (let i = 0; i < height-1; i++) { //z
  //   for (let j = 0; j < width-1; j++) { //x
  //     boxIndices.push(j + i * width, j + (i+1) * width, j + 1 + i * width);
  //     boxIndices.push(j + 1 + i * width, j + (i+1) * width, j + 1 + (i+1) * width);
  //   }
  // }

  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  const normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
  const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    normalAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    6 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(normalAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  gl.useProgram(program);
 
  const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  const worldMatrix = mat4.create();
  const viewMatrix = mat4.create();
  const projMatrix = mat4.create();
  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, -8), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
  mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  const zRotationMatrix = mat4.create();
  const translateMatrix = mat4.create();
  
  //
  // Main render loop
  //
  const identityMatrix = mat4.create();
  mat4.identity(identityMatrix);
  let angle = 0;

  let t1 = performance.now();
  let t2 = performance.now();

  let deltaT = 0;

  let textElement = document.getElementById("hud");
  const loop = () => {
    // Handle Timing
		t2 = performance.now();
		let elapsedTime = t2 - t1;
    deltaT += elapsedTime;
		t1 = t2;

    vec3.add(player.pos, player.pos, player.vel);

    if (deltaT > 100) {
      textElement.textContent = (1000/elapsedTime).toFixed(1) + " fps";
      deltaT = 0;
    }

    if (deltaT % 15 < 1) {
      if (!player.canMove) {
        noiseOffsetZ += noiseDetail;
        recalculateMesh();
      }
    }

    mat4.translate(translateMatrix, identityMatrix, player.pos);

    mat4.rotate(zRotationMatrix, identityMatrix, -Math.PI/6, [1, 0, 0]);
    mat4.mul(worldMatrix, zRotationMatrix, translateMatrix);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.529, 0.808, 0.922, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, boxSize);
    if (haveWireframe) gl.drawArrays(gl.LINES, boxSize, boxVertices.length/9 - boxSize);

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};
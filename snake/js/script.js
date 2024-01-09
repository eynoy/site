let targetSide = 0;
let actualRot = 0;

let y_axis_rotations = 0;

const currentSpeedMultiplier = () => 1.314059 / Math.log(player.body.length+ Math.E);

const mainScreen = () => {
  const modeChosen = (e) => {

    for (let i = 0; i < 4; i++)
      document.body.removeChild(document.body.childNodes[document.body.childNodes.length-1]);
    
    switch (e.srcElement.id) {
      case "b1":
        options.mode = MODES.DD;
        break;
      case "b2":
        options.mode = MODES.CUBE;
        break;
      case "b3":
        options.mode = MODES.LOOP;
        break;
    }

    initGame();
  };

  const title = document.createElement("p");
  title.innerText = "3D Snake";
  title.classList.add("centered");
  title.classList.add("rainbow-text");
  title.style.fontSize = "60px";
  document.body.appendChild(title);

  const option1 = document.createElement("button");
  option1.style.top = "35%";
  option1.innerText = "Classic Version";
  option1.classList.add("centered");
  option1.style.fontSize = "25px";
  option1.id = "b1";
  option1.onclick = modeChosen;
  document.body.appendChild(option1);

  const option2 = document.createElement("button");
  option2.style.top = "45%";
  option2.innerText = "Cube Version";
  option2.classList.add("centered");
  option2.style.fontSize = "25px";
  option2.id = "b2";
  option2.onclick = modeChosen;
  document.body.appendChild(option2);

  const option3 = document.createElement("button");
  option3.style.top = "55%";
  option3.innerText = "Loop Version";
  option3.classList.add("centered");
  option3.style.fontSize = "25px";
  option3.id = "b3";
  option3.onclick = modeChosen;
  document.body.appendChild(option3);
};


const initGame = () => {
  const canvas = document.getElementById('game-surface');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let gl = canvas.getContext('webgl');

  if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert('Your browser does not support WebGL');
    return;
  }

  //Basic settings
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  const program = compileShaders(gl, options.mode === MODES.LOOP);

  if (options.mode === MODES.LOOP) {
    //https://webglfundamentals.org/webgl/lessons/webgl-cube-maps.html
    gl.clearColor(1, 1, 1, 1);

    gl.useProgram(program);

    // lookup uniforms
    const textureLocation = gl.getUniformLocation(program, "u_texture");

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    
    const worldMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const projMatrix = mat4.create();

    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, -4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
    mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    // Create a buffer for positions
    const positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put the positions in the buffer
    const positions = new Float32Array(
      [
      -0.5, -0.5,  -0.5,
      -0.5,  0.5,  -0.5,
      0.5, -0.5,  -0.5,
      -0.5,  0.5,  -0.5,
      0.5,  0.5,  -0.5,
      0.5, -0.5,  -0.5,

      -0.5, -0.5,   0.5,
      0.5, -0.5,   0.5,
      -0.5,  0.5,   0.5,
      -0.5,  0.5,   0.5,
      0.5, -0.5,   0.5,
      0.5,  0.5,   0.5,

      -0.5,   0.5, -0.5,
      -0.5,   0.5,  0.5,
      0.5,   0.5, -0.5,
      -0.5,   0.5,  0.5,
      0.5,   0.5,  0.5,
      0.5,   0.5, -0.5,

      -0.5,  -0.5, -0.5,
      0.5,  -0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,  -0.5,  0.5,
      0.5,  -0.5, -0.5,
      0.5,  -0.5,  0.5,

      -0.5,  -0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,   0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,   0.5,  0.5,
      -0.5,   0.5, -0.5,

      0.5,  -0.5, -0.5,
      0.5,   0.5, -0.5,
      0.5,  -0.5,  0.5,
      0.5,  -0.5,  0.5,
      0.5,   0.5, -0.5,
      0.5,   0.5,  0.5,

      ]);

    const boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(
      positionAttribLocation, // Attribute location
      3, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      gl.FALSE,
      3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    // Create a texture.
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    ctx.lineWidth = 5;
    ctx.drawLine = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    let debug = false;
    
    const gridSize = 10;
    const hudText = document.getElementById("hud");
    hudText.style.color = "black";
    hudText.style.display = "block";

    hudText.innerHTML = "Use The arrow keys to move the snake in a particular direction.<br>" + hudText.innerHTML
    + "<input type='checkbox' id='debug' " + (debug ? "checked" : "") +  "><p style='display: inline-block;'>Debug Mode</p>";

    document.getElementById('debug').addEventListener("change", (e) => {
      debug = !debug;
    });

    player = new LoopSnake();
    fruit = new LoopFruit();

    const generateFace = (ctx, target, faceColor, textColor, text) => {
      const {width, height} = ctx.canvas;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "#00f801";
      for (let i = 0; i < ctx.canvas.width; i += ctx.canvas.width / gridSize) {
        ctx.drawLine(i, 0, i, ctx.canvas.height);
        ctx.drawLine(0, i, ctx.canvas.width, i);
      }

      player.updateSide(ctx, target - gl.TEXTURE_CUBE_MAP_POSITIVE_X);
      if (fruit.gridPos.y === target - gl.TEXTURE_CUBE_MAP_POSITIVE_X) fruit.draw(ctx);

      if (debug) {
        ctx.font = `${width * 0.4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.fillText(text, width / 2, height / 2);
      }
    };

    const faceInfos = [
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, faceColor: '#F00', textColor: '#0FF', text: '+X' },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, faceColor: '#FF0', textColor: '#00F', text: '-X' },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, faceColor: '#0F0', textColor: '#F0F', text: '+Y' },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, faceColor: '#0FF', textColor: '#F00', text: '-Y' },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, faceColor: '#00F', textColor: '#FF0', text: '+Z' },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, faceColor: '#F0F', textColor: '#0F0', text: '-Z' },
    ];

    const updateFaces = () => {
      faceInfos.forEach((faceInfo) => {
        const {target, faceColor, textColor, text} = faceInfo;
        generateFace(ctx, target, faceColor, textColor, text);
      
        // Upload the canvas to the cubemap face.
        const level = 0;
        const internalFormat = gl.RGBA;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        gl.texImage2D(target, level, internalFormat, format, type, ctx.canvas);
      });
    };
    updateFaces();

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    // Draw the scene.
    let then = 0;
    let epochTime = 0;

    let modelYRotationRadians = Math.PI/2;
    let modelXRotationRadians = 0;

    const textElement = document.getElementById("fps");
    const targetRotFromSide = (side, rotations) => {
      let normalAngle = 0;
      switch (side) {
        case 0: normalAngle = Math.PI/2; break;
        case 1: normalAngle = 3 * Math.PI/2; break;
        case 2:
        case 3:
        case 4: normalAngle = Math.PI; break;
        case 5: normalAngle = 0; break;
      }
      return normalAngle
        - (player.body[player.body.length-1].pos.x * Math.PI/72)
        + (Math.PI * 0.139)
        + (Math.PI * 2 * rotations);
    };

    const verticalSpeed = Math.PI/1600;
    const horizontalSpeed = Math.PI/1600;

    let tim = 1;

    const fieldOfViewRadians = Math.PI/3.0;
    const drawScene = () => {
      const time = performance.now();
      // Subtract the previous time from the current time
      const elapsedTime = time - then;
      epochTime += elapsedTime;
      // Remember the current time for the next frame.
      then = time;


      if (epochTime > 600 * currentSpeedMultiplier()) {
        textElement.textContent = (1000/elapsedTime).toFixed(1) + " fps";
        epochTime -= 600 * currentSpeedMultiplier();
        player.update();
        updateFaces();
      }

      if (targetSide === 2) {
        if (modelXRotationRadians < Math.PI / 2) {
          modelXRotationRadians += verticalSpeed * elapsedTime;
          if (modelXRotationRadians > Math.PI / 2) {
            modelXRotationRadians = Math.PI / 2;
          }
        }
      }
      else if (targetSide === 3) {
        if (modelXRotationRadians > -Math.PI / 2) {
          modelXRotationRadians -= verticalSpeed * elapsedTime;
          if (modelXRotationRadians < -Math.PI / 2) {
            modelXRotationRadians = -Math.PI / 2;
          }
        }
      }
      else {
        if (modelXRotationRadians < 0) {
          modelXRotationRadians += verticalSpeed * elapsedTime;
          if (modelXRotationRadians > 0) {
            modelXRotationRadians = 0;
          }
        }
        else {
          modelXRotationRadians -= verticalSpeed * elapsedTime;
          if (modelXRotationRadians < 0) {
            modelXRotationRadians = 0;
          }
        }
      }

      if (modelYRotationRadians < targetRotFromSide(targetSide, y_axis_rotations)) {
        modelYRotationRadians += horizontalSpeed * elapsedTime;
        if (modelYRotationRadians > targetRotFromSide(targetSide, y_axis_rotations)) {
          modelYRotationRadians = targetRotFromSide(targetSide, y_axis_rotations);
        }
      }
      else {
        modelYRotationRadians -= horizontalSpeed * elapsedTime;
        if (modelYRotationRadians < targetRotFromSide(targetSide, y_axis_rotations)) {
          modelYRotationRadians = targetRotFromSide(targetSide, y_axis_rotations);
        }
      }

      // Animate the rotation
      // modelYRotationRadians += -0.7 * deltaTime;
      // modelXRotationRadians += -0.4 * deltaTime;

      const rotMatY = mat4.create();
      mat4.fromYRotation(rotMatY, modelYRotationRadians);

      const rotMatX = mat4.create();
      mat4.fromXRotation(rotMatX, modelXRotationRadians);

      mat4.mul(worldMatrix, rotMatY, rotMatX);
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Tell the shader to use texture unit 0 for u_texture
      gl.uniform1i(textureLocation, 0);

      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

      requestAnimationFrame(drawScene);
    };

    requestAnimationFrame(drawScene);
  }
  else {
    initTextures(gl,
      ["resources/grid.png",
      "resources/snake.png",
      "resources/apple.png"],
      (gl) => {
      const uSamplerLocation = gl.getUniformLocation(program, 'uSampler');

      let floor;
      switch (options.mode) {
        case MODES.DD:
          floor = new Mesh([-50, 0, -50,  0, 0,  0, 1, 0,
                            -50, 0,  50,  0, 20,  0, 1, 0,
                            50, 0,  50,  20, 20,  0, 1, 0,
                            50, 0,  50,  20, 20,  0, 1, 0,
                            50, 0, -50,  20, 0,  0, 1, 0,
                            -50, 0, -50,  0, 0,  0, 1, 0], textures.GRID);
          break;
        case MODES.CUBE:
          floor = new Mesh(boxVertices, textures.GRID, vec3.create(), 50);
          floor.invert();
          floor.tesselateTex(20);
          break;
      }
      meshes.loadMesh(floor);

      meshes.bufferMeshes(gl);
      meshes.setVertexAttrs(gl, program);

      gl.useProgram(program);

      const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
      const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
      const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
      const lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition");
      const additiveColorLocation = gl.getUniformLocation(program, "additiveColor");

      const worldMatrix = mat4.create();
      const viewMatrix = mat4.create();
      const projMatrix = mat4.create();
      mat4.identity(worldMatrix);
      mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, -8), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
      mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
      gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
      gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
      gl.uniform3fv(lightWorldPositionLocation, vec3.fromValues(0, 70, -100));
      gl.uniform3fv(additiveColorLocation, vec3.fromValues(0, 0, 0));
      //gl.uniform3fv(lightWorldPositionLocation, vec3.fromValues(0, 20, -50));
      
      //
      // Main render loop
      //
      const identityMat = mat4.create();
      mat4.identity(identityMat);

      const rotMat = mat4.create();

      let t1 = performance.now();
      let t2 = performance.now();

      let deltaT = 0;
      let superdeltaT = 0;
      let timeSinceBeginning = 0;

      const hudText = document.getElementById("hud");
      hudText.style.display = "block";
      switch (options.mode) {
        case MODES.DD:
          hudText.innerHTML = "Use The arrow keys to move the snake in a particular direction. Use the \"A\" and \"D\" keys to rotate the board. <br>" + hudText.innerHTML;
          player = new Snake(new Vector2D(-2.5, -2.5));
          fruit = new Fruit(-5, -5);
          break;
        case MODES.CUBE:
          hudText.innerHTML = "Use The arrow keys to move the snake in a particular direction. Use the \"W\" and \"S\" keys to move up and down. Use the \"A\" and \"D\" keys to rotate the board. <br>" + hudText.innerHTML;
          player = new Snake3D(new Vector3D(-2.5, -2.5, -2.5));
          fruit = new Fruit3D(-5, 0, -5);
          break;
      }

      const textElement = document.getElementById("fps");
      const loop = () => {
        // Handle Timing
        t2 = performance.now();
        let elapsedTime = t2 - t1;
        deltaT += elapsedTime;
        superdeltaT += elapsedTime;
        timeSinceBeginning += elapsedTime / 1000;
        t1 = t2;

        if (deltaT > 400) {
          textElement.textContent = (1000/elapsedTime).toFixed(1) + " fps";
          deltaT = 0;
        }

        if (superdeltaT > 600 * currentSpeedMultiplier()) {
          meshes.clear();
          meshes.loadMesh(floor);
          gameLoop(elapsedTime);
          meshes.rebufferData(gl);

          superdeltaT = 0;
        }

        if (actualRot < targetSide * Math.PI/2) {
          actualRot += Math.PI/200 * elapsedTime;
          if (actualRot > targetSide * Math.PI/2) {
            actualRot = targetSide * Math.PI/2;
          }
        }
        else {
          actualRot -= Math.PI/200 * elapsedTime;
          if (actualRot < targetSide * Math.PI/2) {
            actualRot = targetSide * Math.PI/2;
          }
        }

        mat4.fromYRotation(rotMat, -actualRot);
        mat4.mul(worldMatrix, rotMat, identityMat);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        mat4.mul(viewMatrix, camera.transform, identityMat);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        meshes.draw(gl, uSamplerLocation, additiveColorLocation);

        requestAnimationFrame(loop);
      };

      meshes.clear();
      meshes.loadMesh(floor);
      gameLoop(0.1);
      meshes.rebufferData(gl);

      requestAnimationFrame(loop);
    });
  }
};
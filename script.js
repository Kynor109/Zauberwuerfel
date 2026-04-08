function toggleText(id) {
  var element = document.getElementById(id);
  if (element) {
    element.classList.toggle("show");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".hidden-text").forEach((element) => {
    element.classList.remove("show");
  });

  document.querySelectorAll(".toggle-header").forEach((header) => {
    header.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      if (targetId) {
        toggleText(targetId);
      }
    });
  });
});

function edit(id) {
  var element = document.getElementById(id);
  if (element) {
    element.classList.toggle("show");
  }
}
const canvasElement = document.getElementById("canvas");
const canvas = new fabric.Canvas("canvas");

let selectedColor = "red";

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", function () {
    selectedColor = this.getAttribute("data-color");
    document
      .querySelectorAll(".color-button")
      .forEach((btn) => btn.classList.remove("selected"));
    this.classList.add("selected");
  });
});

document.querySelector(".color-button.red").classList.add("selected");

function resizeCanvas() {
  const container = document.getElementById("canvas-container");
  const containerWidth = parseFloat(getComputedStyle(container).width);

  const padding = 20;
  const { cellSize, offset } = calculateCubeSize();
  const cubeSize = cellSize * 3;
  const canvasWidth = 250;
  const canvasHeight = 200;

  canvas.setWidth(canvasWidth);
  canvas.setHeight(canvasHeight);
  canvas.renderAll();
}

function calculateCubeSize() {
  const minSize = Math.min(canvas.width, canvas.height);
  const cellSize = (minSize - 100) / 3;
  const offset = { x: cellSize / 2, y: -cellSize / 2 };
  return { cellSize, offset };
}

function getCenteredOrigin(cellSize) {
  return {
    x: 50,
    y: 75,
  };
}

function onStickerClick(e) {
  e.target.set("fill", selectedColor);
  canvas.renderAll();
}

function createSticker(points) {
  const poly = new fabric.Polygon(points, {
    fill: "#ddd",
    stroke: "black",
    strokeWidth: 2,
    selectable: false,
    objectCaching: false,
  });
  poly.on("mousedown", onStickerClick);
  canvas.add(poly);
}

function drawFrontFace(cellSize, frontOrigin) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = frontOrigin.x + col * cellSize;
      const y = frontOrigin.y + row * cellSize;
      createSticker([
        { x: x, y: y },
        { x: x + cellSize, y: y },
        { x: x + cellSize, y: y + cellSize },
        { x: x, y: y + cellSize },
      ]);
    }
  }
}

function drawRightFace(cellSize, offset, frontOrigin) {
  const base = { x: frontOrigin.x + 3 * cellSize, y: frontOrigin.y };
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      createSticker([
        {
          x: base.x + col * offset.x,
          y: base.y + row * cellSize + col * offset.y,
        },
        {
          x: base.x + (col + 1) * offset.x,
          y: base.y + row * cellSize + (col + 1) * offset.y,
        },
        {
          x: base.x + (col + 1) * offset.x,
          y: base.y + (row + 1) * cellSize + (col + 1) * offset.y,
        },
        {
          x: base.x + col * offset.x,
          y: base.y + (row + 1) * cellSize + col * offset.y,
        },
      ]);
    }
  }
}

function drawTopFace(cellSize, offset, frontOrigin) {
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
      createSticker([
        {
          x: frontOrigin.x + row * cellSize + col * offset.x,
          y: frontOrigin.y + col * offset.y,
        },
        {
          x: frontOrigin.x + (row + 1) * cellSize + col * offset.x,
          y: frontOrigin.y + col * offset.y,
        },
        {
          x: frontOrigin.x + (row + 1) * cellSize + (col + 1) * offset.x,
          y: frontOrigin.y + (col + 1) * offset.y,
        },
        {
          x: frontOrigin.x + row * cellSize + (col + 1) * offset.x,
          y: frontOrigin.y + (col + 1) * offset.y,
        },
      ]);
    }
  }
}

function drawCube() {
  canvas.clear();
  const { cellSize, offset } = calculateCubeSize();
  const frontOrigin = getCenteredOrigin(cellSize);
  drawFrontFace(cellSize, frontOrigin);
  drawRightFace(cellSize, offset, frontOrigin);
  drawTopFace(cellSize, offset, frontOrigin);
  canvas.renderAll();
}

window.addEventListener("resize", () => {
  resizeCanvas();
  drawCube();
});

window.addEventListener("load", () => {
  resizeCanvas();
  drawCube();
});

let colorCount = {
  red: 0,
  blue: 0,
  green: 0,
  yellow: 0,
  white: 0,
  orange: 0,
};

function onStickerClick(e) {
  let oldColor = e.target.fill;
  if (oldColor === selectedColor) return;

  if (colorCount[selectedColor] >= 9) {
    return;
  }

  if (oldColor in colorCount) {
    colorCount[oldColor]--;
  }

  e.target.set("fill", selectedColor);
  colorCount[selectedColor]++;
  canvas.renderAll();

  updateColorDisplay();
}

document.addEventListener("DOMContentLoaded", function () {
  const cube = new Cube();
  const twisty = document.getElementById("twisty");

  function updateTwisty() {
    twisty.setAttribute("alg", cube.toString());
  }

  document.getElementById("resetCube").addEventListener("click", function () {
    cube.identity();
    updateTwisty();
  });

  document
    .getElementById("randomizeCube")
    .addEventListener("click", function () {
      cube.randomize();
      updateTwisty();
    });

  document.getElementById("solveCube").addEventListener("click", function () {
    Cube.initSolver();
    const solution = cube.solve();
    alert("Lösung: " + solution);
    cube.move(solution);
    updateTwisty();
  });

  updateTwisty();
});

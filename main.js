const mainCanvas = document.getElementById('main-canvas');
const width = window.innerWidth / 2;
const height = window.innerHeight;
mainCanvas.width = width;
mainCanvas.height = height;

/** @type {CanvasRenderingContext2D} */
const mainCtx = mainCanvas.getContext('2d');

const worldSize = 100;

let world;

function reset() {
  const worldSize = parseInt(document.getElementById('world-size').value);
  const populationSize = parseInt(
    document.getElementById('population-size').value
  );

  world = new World(
    mainCanvas.width / 2,
    mainCanvas.height / 2,
    mainCanvas.width,
    mainCanvas.height,
    worldSize
  );

  world.populate(populationSize);

  //   world.population.push(new Entity(world, 1, 2, 'KEYS'));
  //   world.population.push(new Entity(world, 4, 3));
}

function select() {
  if (world) {
    world.selection();
  }
}

animate();

function animate() {
  mainCanvas.width = width;
  mainCanvas.height = height;
  if (world) {
    world.draw(mainCtx);
    world.population.forEach((entity) => {
      entity.update();
      entity.draw(mainCtx, (world.cellSize / 2) * 0.8);
    });
  }
  requestAnimationFrame(animate);
}

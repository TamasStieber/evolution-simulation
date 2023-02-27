class Entity {
  constructor(world, x, y, controlType, neuralNetwork) {
    this.world = world;
    this.x = x;
    this.y = y;

    this.useBrain = controlType === 'AI';

    this.sensor = new Sensor(this);

    if (!neuralNetwork) {
      this.neuralNetwork = new NeuralNetwork([this.sensor.rayCount, 5, 4]);
    } else {
      this.neuralNetwork = neuralNetwork;
    }

    this.controls = new Controls(controlType);
  }

  reproduce(partner) {
    return NeuralNetwork.crossover(this, partner);
  }

  update() {
    this.#move();
    this.sensor.update();
    const offsets = this.sensor.readings.map((s) =>
      s === null ? 0 : 1 - s.offset
    );
    const outputs = NeuralNetwork.feedForward(offsets, this.neuralNetwork);

    if (this.useBrain) {
      this.controls.up = outputs[0];
      this.controls.left = outputs[1];
      this.controls.right = outputs[2];
      this.controls.down = outputs[3];
    }
  }

  #move() {
    if (this.controls.up && this.y > 1) {
      if (!this.world.isCellOccupied([this.x, this.y - 1])) {
        this.y -= 1;
      }
    }
    if (this.controls.left && this.x > 1) {
      if (!this.world.isCellOccupied([this.x - 1, this.y])) {
        this.x -= 1;
      }
    }
    if (this.controls.right && this.x < this.world.cells) {
      if (!this.world.isCellOccupied([this.x + 1, this.y])) {
        this.x += 1;
      }
    }
    if (this.controls.down && this.y < this.world.cells) {
      if (!this.world.isCellOccupied([this.x, this.y + 1])) {
        this.y += 1;
      }
    }
  }

  draw(ctx, cellSize) {
    // this.sensor.draw(ctx);

    ctx.beginPath();
    ctx.arc(
      this.world.getWorldXCoordinate(this.x),
      this.world.getWorldYCoordinate(this.y),
      cellSize,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'green';
    ctx.fill();
  }
}

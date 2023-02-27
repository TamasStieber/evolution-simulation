class World {
  constructor(x, y, width, height, cells) {
    this.margin = 10;
    this.x = x;
    this.y = y;
    this.width = width < height ? width : height;
    this.height = width < height ? width : height;
    this.cells = cells;

    this.left = x - this.width / 2 + this.margin;
    this.right = x + this.width / 2 - this.margin;
    this.top = y - this.height / 2 + this.margin;
    this.bottom = y + this.height / 2 - this.margin;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.population = [];

    this.generation = 0;
    this.generationsHistory = [];

    this.borders = [
      [topLeft, topRight],
      [topRight, bottomRight],
      [bottomRight, bottomLeft],
      [bottomLeft, topLeft],
    ];

    this.cellSize = (this.right - this.left) / this.cells;
  }

  isCellOccupied(worldPosition) {
    const found = this.population.find(
      (entity) => entity.x === worldPosition[0] && entity.y === worldPosition[1]
    );
    if (found) return true;
    else return false;
  }

  getWorldXCoordinate(coordinate) {
    if (coordinate <= 0) {
      coordinate = 1;
    } else if (coordinate > this.cells) {
      coordinate = this.cells;
    }
    return this.left + coordinate * this.cellSize - this.cellSize / 2;
  }
  getWorldYCoordinate(coordinate) {
    if (coordinate <= 0) {
      coordinate = 1;
    } else if (coordinate > this.cells) {
      coordinate = this.cells;
    }
    return this.top + coordinate * this.cellSize - this.cellSize / 2;
  }

  #getRandomCoordinate() {
    return Math.floor(Math.random() * this.cells + 1);
  }

  populate(populationSize) {
    this.population = [];
    for (let i = 0; i < populationSize; i++) {
      while (true) {
        const randomXCoordinate = this.#getRandomCoordinate();
        const randomYCoordinate = this.#getRandomCoordinate();

        const found = this.population.find(
          (element) =>
            element.x === randomXCoordinate && element.y === randomYCoordinate
        );

        if (!found) {
          this.population.push(
            new Entity(this, randomXCoordinate, randomYCoordinate, 'AI')
          );

          break;
        }
      }
    }
    document.getElementById('generations-history').innerHTML = '';
  }

  selection() {
    const survivors = [];
    world.population.forEach((entity) => {
      if (entity.x >= world.cells * 0.75) {
        survivors.push(entity);
      }

      // if (
      //   (entity.x >= 1 && entity.x <= world.cells * 0.25) ||
      //   (entity.x >= world.cells * 0.75 && entity.x <= world.cells)
      // ) {
      //   survivors.push(entity);
      // }
    });
    this.#repopulateWithSurvivorsChildren(survivors);
  }

  #repopulateWithSurvivorsChildren(survivors) {
    const populationSize = parseInt(
      document.getElementById('population-size').value
    );

    this.population = [];

    while (this.population.length < populationSize) {
      for (let i = 0; i < survivors.length - 1; i += 2) {
        while (true) {
          const randomXCoordinate = this.#getRandomCoordinate();
          const randomYCoordinate = this.#getRandomCoordinate();

          const found = this.population.find(
            (element) =>
              element.x === randomXCoordinate && element.y === randomYCoordinate
          );

          if (!found) {
            this.population.push(
              new Entity(
                this,
                randomXCoordinate,
                randomYCoordinate,
                'AI',
                survivors[i].reproduce(survivors[i + 1])
              )
            );

            break;
          }
        }
        if (this.population.length === populationSize) break;
      }
    }

    // this.populate(populationSize);
    // const bestBrain = survivors[0].neuralNetwork;
    // this.population.forEach((entity) => {
    //   entity.neuralNetwork = bestBrain;
    // });

    if (document.getElementById('mutation').checked) {
      const mutationChanceForEntity =
        parseInt(document.getElementById('entity-mutation-chance').value) / 100;
      const mutationChanceForGene =
        parseInt(document.getElementById('gene-mutation-chance').value) / 100;
      const randomGenes = document.getElementById('random-genes').checked;
      const mutationAmount =
        parseInt(document.getElementById('gene-mutation-amount').value) / 100;

      this.population.forEach((entity) => {
        if (Math.random() < mutationChanceForEntity) {
          NeuralNetwork.mutate(
            entity.neuralNetwork,
            mutationAmount,
            randomGenes,
            mutationChanceForGene
          );
        }
      });
    }

    this.generationsHistory.push([
      this.generation,
      survivors.length,
      ((survivors.length / this.population.length) * 100).toFixed(2),
      this.population.length,
    ]);
    this.generation++;

    document.getElementById(
      'generations'
    ).innerHTML = `Current Generation: ${this.generation}`;

    document.getElementById('generations-history').innerHTML =
      'Generation history:';

    this.generationsHistory.forEach((history) => {
      const htmlTag = document.createElement('p');
      const text = document.createTextNode(
        `Generation: ${history[0]}, Survivors: ${history[1]}, Survival rate: ${history[2]}%`
      );
      htmlTag.appendChild(text);

      document.getElementById('generations-history').appendChild(htmlTag);
    });
  }

  draw(ctx) {
    ctx.strokeStyle = 'darkgray';

    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });

    for (let i = 1; i < this.cells; i++) {
      const x = lerp(this.left, this.right, i / this.cells);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
    for (let i = 1; i < this.cells; i++) {
      const y = lerp(this.top, this.bottom, i / this.cells);
      ctx.beginPath();
      ctx.moveTo(this.left, y);
      ctx.lineTo(this.right, y);
      ctx.stroke();
    }
  }
}

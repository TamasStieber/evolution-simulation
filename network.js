class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  static crossover(entity1, entity2) {
    const newNeuralNetwork = entity1.neuralNetwork;
    for (let i = 0; i < newNeuralNetwork.levels.length; i++) {
      for (let j = 0; j < newNeuralNetwork.levels[i].thresholds.length; j++) {
        if (Math.random() > 0.5) {
          newNeuralNetwork.levels[i].thresholds[j] =
            entity2.neuralNetwork.levels[i].thresholds[j];
        }
      }
      for (let j = 0; j < newNeuralNetwork.levels[i].weights.length; j++) {
        for (let k = 0; k < newNeuralNetwork.levels[i].weights[j].length; k++) {
          if (Math.random() > 0.5) {
            newNeuralNetwork.levels[i].weights[j][k] =
              entity2.neuralNetwork.levels[i].weights[j][k];
          }
        }
      }
    }
    return newNeuralNetwork;
  }

  static mutate(network, amount = 1, isRandom, randomChance = 0.5) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.thresholds.length; i++) {
        if (Math.random() < randomChance || !isRandom) {
          level.thresholds[i] = lerp(
            level.thresholds[i],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          if (Math.random() < randomChance || !isRandom) {
            level.weights[i][j] = lerp(
              level.weights[i][j],
              Math.random() * 2 - 1,
              amount
            );
          }
        }
      }
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.thresholds = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.thresholds.length; i++) {
      level.thresholds[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      if (sum > level.thresholds[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}

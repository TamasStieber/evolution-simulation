class Controls {
  constructor(type) {
    this.up = false;
    this.left = false;
    this.right = false;
    this.down = false;

    switch (type) {
      case 'KEYS':
        this.#addKeyboardListener();
        break;
      case 'DUMMY':
        this.up = true;
        break;
    }
  }

  #addKeyboardListener() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
        case 'ArrowUp':
          this.up = true;
          break;
        case 'ArrowDown':
          this.down = true;
          break;
      }
    };

    document.onkeyup = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
        case 'ArrowUp':
          this.up = false;
          break;
        case 'ArrowDown':
          this.down = false;
          break;
      }
    };
  }
}

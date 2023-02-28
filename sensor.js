class Sensor {
  constructor(entity) {
    this.entity = entity;
    this.world = this.entity.world;
    this.rayCount = 8;
    this.rayLength = this.world.width;
    this.raySpread = Math.PI * 2;

    this.rays = [];
    this.readings = [];
  }

  update() {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], this.world.borders));
    }
  }

  #getReading(ray, worldBorders) {
    let touches = [];

    for (let i = 0; i < worldBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        worldBorders[i][0],
        worldBorders[i][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset === minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        this.rayCount === 1 ? 0.5 : i / this.rayCount
      );

      const start = {
        x: this.world.getWorldXCoordinate(this.entity.x),
        y: this.world.getWorldYCoordinate(this.entity.y),
      };
      const end = {
        x:
          this.world.getWorldXCoordinate(this.entity.x) -
          Math.sin(rayAngle) * this.rayLength,
        y:
          this.world.getWorldYCoordinate(this.entity.y) -
          Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}

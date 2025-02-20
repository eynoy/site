class Flow2D {
	constructor(initialX, initialY, color) {
		this.position = {x: initialX, y: initialY};

		this.initialX = initialX;
		this.initialY = initialY;

		this.flowX = [initialX];
		this.flowY = [initialY];

		this.color = color;
	}

	update(dt, firstOrderDiffEqX, firstOrderDiffEqY) {
		this.position.x += firstOrderDiffEqX(this.position.x, this.position.y) * dt;
		this.position.y += firstOrderDiffEqY(this.position.x, this.position.y) * dt;

		this.flowX.push(this.position.x);
		this.flowY.push(this.position.y);
	}

	draw() {
		drawPlotCoordCurve(this.flowX, this.flowY, this.color);
		drawCircle(this.initialX, this.initialY, 2, "Black");
		drawCircle(this.position.x, this.position.y, 4, this.color);
	}
}
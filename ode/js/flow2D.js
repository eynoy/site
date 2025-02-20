const numIterations = 10000;

class Flow2D {
	constructor(initialX, initialY, firstOrderDiffEqX, firstOrderDiffEqY, dt, color, preCalculateFlows = false) {
		this.initialX = initialX;
		this.initialY = initialY;

		this.flowX = [initialX];
		this.flowY = [initialY];

		this.firstOrderDiffEqX = firstOrderDiffEqX;
		this.firstOrderDiffEqY = firstOrderDiffEqY;

		this.dt = dt;
		this.color = color;
		this.preCalculateFlows = preCalculateFlows;

		if (this.preCalculateFlows) {
			for (let i = 0; i < numIterations; i++) {
				this.calculateNextFlowState();
			}
		}

		this.currentPositionIndex = 0;
	}

	calculateNextFlowState() {
		const i = this.flowX.length-1;

		const nextX = this.flowX[i] + this.firstOrderDiffEqX(this.flowX[i], this.flowY[i]) * this.dt;
		const nextY = this.flowY[i] + this.firstOrderDiffEqY(this.flowX[i], this.flowY[i]) * this.dt;

		this.flowX.push(nextX);
		this.flowY.push(nextY);
	}

	update() {
		if (!this.preCalculateFlows) this.calculateNextFlowState();

		if (this.currentPositionIndex < numIterations - 1) {
			this.currentPositionIndex++;
		}
		else {
			console.log("!sx");
		}
	}

	draw() {
		drawPlotCoordCurve(this.flowX, this.flowY, this.color);
		drawCircle(this.initialX, this.initialY, 2, "Red");
		drawCircle(this.flowX[this.currentPositionIndex], this.flowY[this.currentPositionIndex], 4, this.color);
	}
}
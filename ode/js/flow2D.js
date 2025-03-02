const numIterations = 10000;

class Flow2D {
	constructor(initialX, initialY, firstOrderDiffEqX, firstOrderDiffEqY, dt, color, preCalculateFlows = false) {
		this.initialX = initialX;
		this.initialY = initialY;

		this.flowX = [initialX];
		this.flowY = [initialY];

		this.firstOrderDiffEqX = firstOrderDiffEqX;
		this.firstOrderDiffEqY = firstOrderDiffEqY;
		this.vels = [mag(firstOrderDiffEqX(initialX, initialY), firstOrderDiffEqY(initialX, initialY))]

		this.dt = dt;
		this.color = color;
		this.preCalculateFlows = preCalculateFlows;

		if (this.preCalculateFlows) {
			for (let i = 0; i < numIterations; i++) {
				if (this.currentPositionIndex >= 1 && !plotBBox.contains(this.flowX[this.currentPositionIndex], this.flowY[this.currentPositionIndex])) {
					break;
				}

				this.calculateNextFlowState();
			}
		}

		this.currentPositionIndex = 0;
		this.flowing = true;
	}

	calculateNextFlowState() {
		const i = this.flowX.length-1;

		const nextX = this.flowX[i] + this.firstOrderDiffEqX(this.flowX[i], this.flowY[i]) * this.dt;
		const nextY = this.flowY[i] + this.firstOrderDiffEqY(this.flowX[i], this.flowY[i]) * this.dt;

		this.flowX.push(nextX);
		this.flowY.push(nextY);
		this.vels.push(mag(this.firstOrderDiffEqX(nextX, nextY), this.firstOrderDiffEqY(nextX, nextY)));
	}

	update() {
		if (!this.flowing) return;

		if (this.currentPositionIndex >= numIterations) {
			this.flowing = false;
			return;
		}

		if (this.currentPositionIndex >= 1 && !plotBBox.contains(this.flowX[this.currentPositionIndex], this.flowY[this.currentPositionIndex])) {
			this.flowing = false;
			return;
		}

		if (!this.preCalculateFlows) this.calculateNextFlowState();
		this.currentPositionIndex++;
	}

	draw() {
		drawPlotCoordCurve(this.flowX, this.flowY, this.vels, this.color);
		drawCircle(this.initialX, this.initialY, 2, "Red");
		if (this.flowing) drawCircle(this.flowX[this.currentPositionIndex], this.flowY[this.currentPositionIndex], 4, this.color);
	}
}
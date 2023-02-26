export class GameObject {
    constructor(x = 0, y = 0, theta = 0, dxdt = 0, dydt = 0) {
        this.x = x;
        this.y = y;
        this.theta = theta;
        this.dxdt = dxdt;
        this.dydt = dydt;
        this._needs_to_be_destroyed = false;
    }
    update_callback(dt) { }
    destroy() { this._needs_to_be_destroyed = true; }
    get needs_to_be_destroyed() { return this._needs_to_be_destroyed; }
    update(width, height, dt) {
        this.x += this.dxdt * dt;
        this.y += this.dydt * dt;
        if (this.x < 0)
            this.x += width;
        if (this.x > width)
            this.x -= width;
        if (this.y < 0)
            this.y += height;
        if (this.y > height)
            this.y -= height;
        this.update_callback(dt);
        return this.needs_to_be_destroyed;
    }
}
//# sourceMappingURL=game_object.js.map
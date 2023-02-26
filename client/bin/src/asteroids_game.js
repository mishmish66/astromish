class GameObject {
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
class PolyGameObject extends GameObject {
    constructor(x, y, theta, verts, dxdt = 0, dydt = 0, stroke_width = 5) {
        super(x, y, theta);
        this.verts = verts;
        this.dxdt = dxdt;
        this.dydt = dydt;
        this.stroke_width = stroke_width;
    }
    draw(context) {
        // context.imageSmoothingEnabled = false;
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.theta);
        context.beginPath();
        context.moveTo(this.verts[0].x, this.verts[0].y);
        this.verts.forEach((vert) => { context.lineTo(vert.x, vert.y); });
        context.closePath();
        context.fillStyle = 'black';
        context.fill();
        context.clip();
        context.strokeStyle = 'white';
        context.lineWidth = this.stroke_width;
        context.stroke();
        context.restore();
    }
}
export class Ship extends PolyGameObject {
    constructor(x, y, theta) {
        super(x, y, theta, [
            new DOMPoint(-25, -20),
            new DOMPoint(-10, 0),
            new DOMPoint(-25, 20),
            new DOMPoint(50, 0)
        ]);
        this.max_laser_cooldown = 250;
        this.laser_cooldown = 0;
    }
    thrust(x, y, dt, thrust_factor = 0.005) {
        let thrust = thrust_factor * dt;
        this.dxdt = this.dxdt * (1 - thrust) + x * thrust;
        this.dydt = this.dydt * (1 - thrust) + y * thrust;
    }
    apply_input_acceleration(keys_down, dt) {
        const forwards_max_speed = 2.0;
        const backwards_max_speed = 1.0;
        if (keys_down['w']) {
            this.thrust(Math.cos(this.theta) * forwards_max_speed, Math.sin(this.theta) * forwards_max_speed, dt);
        }
        if (keys_down['s']) {
            this.thrust(-Math.cos(this.theta) * backwards_max_speed, -Math.sin(this.theta) * backwards_max_speed, dt);
        }
        if (!keys_down['w'] && !keys_down['s']) {
            this.dxdt *= 0.99;
            this.dydt *= 0.99;
        }
    }
    apply_input_rotation(keys_down, dt) {
        const dtheta_dt = 0.01;
        const dtheta = dtheta_dt * dt;
        if (keys_down['a']) {
            this.theta -= dtheta;
        }
        if (keys_down['d']) {
            this.theta += dtheta;
        }
        if (this.theta < 0) {
            this.theta += 2 * Math.PI;
        }
        else if (this.theta > 2 * Math.PI) {
            this.theta -= 2 * Math.PI;
        }
    }
    apply_input(keys_down, dt) {
        this.apply_input_acceleration(keys_down, dt);
        this.apply_input_rotation(keys_down, dt);
        if (keys_down[' '] && this.laser_cooldown <= 0) {
            this.laser_cooldown = this.max_laser_cooldown;
            return [new Laser(this.x, this.y, this.theta)];
        }
        return [];
    }
    update_callback(dt) {
        this.laser_cooldown = Math.max(this.laser_cooldown - dt, 0);
    }
}
export class Asteroid extends PolyGameObject {
    constructor(x, y, theta, radius = 100) {
        const max_verts = 12;
        const min_verts = 6;
        const max_bump = radius * 0.5;
        const max_dip = radius * 0.8;
        const verts = Asteroid.make_randomish_asteroid_points(radius, max_verts, min_verts, max_bump, max_dip);
        super(x, y, theta, verts);
    }
    static make_randomish_asteroid_points(radius, max_verts, min_verts, max_bump, max_dip) {
        let verts = [];
        let max_angle = 2 * Math.PI / min_verts;
        let min_angle = 2 * Math.PI / max_verts;
        let bump_range = max_bump + max_dip;
        let angle = 0;
        while (angle < (2 * Math.PI)) {
            let height = radius + Math.random() * bump_range - max_dip;
            verts.push(new DOMPoint(height * Math.cos(angle), height * Math.sin(angle)));
            angle += min_angle + Math.random() * (max_angle - min_angle);
        }
        return verts;
    }
}
class Laser extends GameObject {
    constructor(x = 0, y = 0, theta = 0, stroke_width = 5, max_lifetime = 2000, laser_length = 25) {
        const light_speed = 3.0;
        const dxdt = light_speed * Math.cos(theta);
        const dydt = light_speed * Math.sin(theta);
        super(x, y, theta, dxdt, dydt);
        this.stroke_width = stroke_width;
        this.max_lifetime = max_lifetime;
        this.laser_length = laser_length;
    }
    update_callback(dt) {
        this.max_lifetime -= dt;
        if (this.max_lifetime <= 0)
            this.destroy();
    }
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.theta);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.laser_length, 0);
        context.closePath();
        context.strokeStyle = 'white';
        context.lineWidth = 5;
        context.stroke();
        context.restore();
    }
}
export class AsteroidsGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys_down = {};
        this.ship = new Ship(500, 500, 0);
        this.asteroids = [];
        this.lasers = [];
        this.last_time = Date.now();
    }
    keydown_handler(event) {
        this.keys_down[event.key] = true;
    }
    keyup_handler(event) {
        this.keys_down[event.key] = false;
    }
    game_objects() {
        return [...this.asteroids, ...this.lasers, this.ship];
    }
    destroy_destroyed_objects() {
        this.asteroids = this.asteroids.filter((asteroid) => !asteroid.needs_to_be_destroyed);
        this.lasers = this.lasers.filter((laser) => !laser.needs_to_be_destroyed);
    }
    update_canvas() {
        const context = this.canvas.getContext('2d');
        if (context === null)
            throw new Error('Could not get canvas context');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update_positions();
        this.game_objects().forEach((game_object) => { game_object.draw(context); });
        this.destroy_destroyed_objects();
    }
    update_positions() {
        const now = Date.now();
        const dt = now - this.last_time;
        this.lasers = this.lasers.concat(this.ship.apply_input(this.keys_down, dt));
        this.game_objects().forEach((game_object) => { game_object.update(this.canvas.width, this.canvas.height, dt); });
        this.last_time = now;
    }
}
//# sourceMappingURL=asteroids_game.js.map
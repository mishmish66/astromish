import { PolyGameObject } from "../../game/poly_game_object.js";
import { AsteroidsLaser } from "./asteroids_laser.js";
export class AsteroidsShip extends PolyGameObject {
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
            return [new AsteroidsLaser(this.x, this.y, this.theta)];
        }
        return [];
    }
    update_callback(dt) {
        this.laser_cooldown = Math.max(this.laser_cooldown - dt, 0);
    }
}
//# sourceMappingURL=asteroids_ship.js.map
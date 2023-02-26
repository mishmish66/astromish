import { PolyGameObject } from "../../game/poly_game_object.js";
import { AsteroidsLaser } from "./asteroids_laser.js";

export class AsteroidsShip extends PolyGameObject
{
    constructor(x: number, y: number, theta: number)
    {
        super(x, y, theta, [
            new DOMPoint(-25, -20),
            new DOMPoint(-10, 0),
            new DOMPoint(-25, 20),
            new DOMPoint(50, 0)
        ]);
    }

    public max_laser_cooldown: number = 250;

    public laser_cooldown: number = 0;

    private thrust(x: number, y: number, dt: number, thrust_factor: number = 0.005): void
    {
        let thrust = thrust_factor * dt;

        this.dxdt = this.dxdt * (1 - thrust) + x * thrust;
        this.dydt = this.dydt * (1 - thrust) + y * thrust;
    }

    public apply_input_acceleration(keys_down: { [key: string]: boolean }, dt: number): void
    {
        const forwards_max_speed = 2.0
        const backwards_max_speed = 1.0

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

    public apply_input_rotation(keys_down: { [key: string]: boolean }, dt: number): void
    {
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
        } else if (this.theta > 2 * Math.PI) {
            this.theta -= 2 * Math.PI;
        }
    }

    public apply_input(keys_down: { [key: string]: boolean }, dt: number): AsteroidsLaser[]
    {
        this.apply_input_acceleration(keys_down, dt);
        this.apply_input_rotation(keys_down, dt);

        if (keys_down[' '] && this.laser_cooldown <= 0) {
            this.laser_cooldown = this.max_laser_cooldown;

            return [new AsteroidsLaser(this.x, this.y, this.theta)];
        }

        return [];
    }

    override update_callback(dt: number): void
    {
        this.laser_cooldown = Math.max(this.laser_cooldown - dt, 0);
    }
}
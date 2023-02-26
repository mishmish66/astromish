import { GameObject } from '../../game/game_object.js';
export class AsteroidsLaser extends GameObject {
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
//# sourceMappingURL=asteroids_laser.js.map
import { GameObject } from '../../game/game_object.js';

export class AsteroidsLaser extends GameObject
{
    constructor(x: number = 0, y: number = 0, theta: number = 0, public stroke_width: number = 5, private max_lifetime: number = 2000, private laser_length: number = 25)
    {
        const light_speed = 3.0;

        const dxdt = light_speed * Math.cos(theta);
        const dydt = light_speed * Math.sin(theta);

        super(x, y, theta, dxdt, dydt);
    }

    override update_callback(dt: number): void
    {
        this.max_lifetime -= dt;

        if (this.max_lifetime <= 0)
            this.destroy();
    }

    public draw(context: CanvasRenderingContext2D)
    {
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
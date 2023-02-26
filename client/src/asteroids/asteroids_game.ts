import { GameObject } from '../game/game_object.js';

import { AsteroidsShip } from './game_objects/asteroids_ship.js';
import { AsteroidsAsteroid } from './game_objects/asteroids_asteroid.js';
import { AsteroidsLaser } from './game_objects/asteroids_laser.js';

export class AsteroidsGame
{
    constructor(private canvas: HTMLCanvasElement)
    {
        this.game_objects = [];

        this._ship = undefined
    }
    private keys_down: { [key: string]: boolean } = {};

    private game_objects: GameObject[];

    private _ship?: AsteroidsShip;

    private last_time: number = Date.now();

    private get ship(): AsteroidsShip
    {
        if (this._ship === undefined) {
            this._ship = new AsteroidsShip(this.canvas.width / 2, this.canvas.height / 2, 0);
            this.game_objects.push(this._ship);
        }

        return this._ship;
    }

    public keydown_handler(event: KeyboardEvent): void
    {
        this.keys_down[event.key] = true;
    }

    public keyup_handler(event: KeyboardEvent): void
    {
        this.keys_down[event.key] = false;
    }

    private destroy_destroyed_objects(): void
    {
        this.game_objects = this.game_objects.filter((game_object) => !game_object.needs_to_be_destroyed);
    }

    public update_canvas(): void
    {
        const context = this.canvas.getContext('2d');
        if (context === null)
            throw new Error('Could not get canvas context');

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.update_positions();

        this.game_objects.forEach((game_object) => { game_object.draw(context); });

        this.destroy_destroyed_objects();
    }

    private add_game_objects(game_objects: GameObject[]): void
    {
        this.game_objects = this.game_objects.concat(game_objects);
    }

    private update_positions(): void
    {
        const now = Date.now();
        const dt = now - this.last_time;
        this.add_game_objects(this.ship.apply_input(this.keys_down, dt));

        this.game_objects.forEach((game_object) => { game_object.update(this.canvas.width, this.canvas.height, dt) });
        this.last_time = now;
    }
}
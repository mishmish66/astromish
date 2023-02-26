import { AsteroidsShip } from './game_objects/asteroids_ship.js';
export class AsteroidsGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys_down = {};
        this.last_time = Date.now();
        this.game_objects = [];
        this._ship = undefined;
    }
    get ship() {
        if (this._ship === undefined) {
            this._ship = new AsteroidsShip(this.canvas.width / 2, this.canvas.height / 2, 0);
            this.game_objects.push(this._ship);
        }
        return this._ship;
    }
    keydown_handler(event) {
        this.keys_down[event.key] = true;
    }
    keyup_handler(event) {
        this.keys_down[event.key] = false;
    }
    destroy_destroyed_objects() {
        this.game_objects = this.game_objects.filter((game_object) => !game_object.needs_to_be_destroyed);
    }
    update_canvas() {
        const context = this.canvas.getContext('2d');
        if (context === null)
            throw new Error('Could not get canvas context');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update_positions();
        this.game_objects.forEach((game_object) => { game_object.draw(context); });
        this.destroy_destroyed_objects();
    }
    add_game_objects(game_objects) {
        this.game_objects = this.game_objects.concat(game_objects);
    }
    update_positions() {
        const now = Date.now();
        const dt = now - this.last_time;
        this.add_game_objects(this.ship.apply_input(this.keys_down, dt));
        this.game_objects.forEach((game_object) => { game_object.update(this.canvas.width, this.canvas.height, dt); });
        this.last_time = now;
    }
}
//# sourceMappingURL=asteroids_game.js.map
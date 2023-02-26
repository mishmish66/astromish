import { AsteroidsGame } from './src/asteroids/asteroids_game.js';
const body = document.getElementsByTagName('body')[0];
const canvas = document.createElement('canvas');
canvas.className = 'asteroids-game';
body.appendChild(canvas);
const scale = window.devicePixelRatio;
let game = new AsteroidsGame(canvas);
document.addEventListener('keydown', (event) => {
    game.keydown_handler(event);
});
document.addEventListener('keyup', (event) => {
    game.keyup_handler(event);
});
function draw() {
    const rect = canvas.getBoundingClientRect();
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    game.update_canvas();
    requestAnimationFrame(draw);
}
draw();
//# sourceMappingURL=index.js.map
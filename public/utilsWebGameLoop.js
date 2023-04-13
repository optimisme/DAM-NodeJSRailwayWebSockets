// Gameloop de l'aplicació
var targetFPS = 60;
var fps = 0;
var lastFrameTime = Date.now();

function gameLoop() {
    // Calcula els FPS
    let now = Date.now();
    let elapsed = now - lastFrameTime;
    lastFrameTime = now;
    fps = Math.round(1000 / elapsed);

    // Fes aquí el que vulguis fer cada 30 frames per segon
    if (run) {
        run(fps)
    }
  
    // Programa la següent crida a aquesta mateixa funció en 1/30 segons
    var delay = Math.max(0, 1000 / targetFPS - elapsed);
    setTimeout(function() {
        requestAnimationFrame(gameLoop);
    }, delay);
}

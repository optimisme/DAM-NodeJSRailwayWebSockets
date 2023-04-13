// Aquesta funció genera una espera de "time" milisegons en funcions "async"
function wait (time) {
    return new Promise((resolve, request) => {
        setTimeout(resolve, time);
    })
}
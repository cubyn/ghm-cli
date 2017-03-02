const colors = require('colors');

function log(color, newline) {
    return (message) => {
        console.log((newline ? '\n' : '') + color(message));
    }
}

module.exports = {
    info: log(colors.cyan, true),
    error: log(colors.red),
    warn: log(colors.white),
    success: log(colors.green)
};
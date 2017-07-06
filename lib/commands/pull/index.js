module.exports = yargs => {
    return yargs
        .command(require('./list'));
};

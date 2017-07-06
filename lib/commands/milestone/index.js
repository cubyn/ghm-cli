module.exports = yargs => {
    return yargs
        .command(require('./list'))
        .command(require('./close'))
        .command(require('./open'))
        .command(require('./update'));
};

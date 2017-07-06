module.exports = yargs => {
    return yargs
        .command(require('./close'))
        .command(require('./create'))
        .command(require('./delete'))
        .command(require('./list'))
        .command(require('./open'))
        .command(require('./update'));
};

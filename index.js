#!/usr/bin/env node --harmony

const yargs = require('yargs');

process.on('unhandledRejection', (error, promise) => {
    console.log(error.stack);
});

const argv = yargs
    .usage('$0 <cmd> [args]')
    .command(require('./lib/commands/login'))
    .command(require('./lib/commands/clean'))
    .command('milestone', 'ghm milestone -h to list sub-commands', require('./lib/commands/milestone'))
    .command('pull', 'ghm pull -h to list sub-commands', require('./lib/commands/pull'))
    .demand(1, "must provide a valid command")
    .help("h")
    .alias("h", "help")
    .argv;

// default:
// show help when no arg provided
if (!argv._[0]) {
    yargs.showHelp();
    process.exit(1);
}

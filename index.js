#!/usr/bin/env node --harmony

const yargs = require('yargs');

const update = require('./lib/commands/update');
const changeStatus = require('./lib/commands/change-status');
const login = require('./lib/commands/login');
const list = require('./lib/commands/list');

process.on('unhandledRejection', (error, promise) => {
    console.log(error.stack);
});

const argv = yargs
    .usage('$0 <cmd> [args]')
    .command('login', 'Login to Github (no password ever stored)', {}, login)
    .command('list', 'List milestones in all your repositories', {
        state: {
            alias: 's',
            type: 'state',
            choices: ['all', 'open', 'closed'],
            describe: 'force update on closed milestones as well'
        }
    }, list)
    .command('close [milestone]', 'Close milestone', {}, changeStatus('closed'))
    .command('open [milestone]', 'Re-open milestone', {}, changeStatus('open'))
    .command('update [milestone]', 'Update milestone', {
        force: {
            alias: 'f',
            type: 'boolean',
            describe: 'force update on closed milestones as well'
        },
        title: {
            alias: 't',
            type: 'string',
            describe: 'title to change to'
        },
        due: {
            alias: 'd',
            type: 'string',
            describe: 'milestone\'s due date. format: YYYY-MM-DD'
        }
    }, update)
    .example('close "Milestone #1"', 'Will close all milestones named "Milestone #1"')
    .example('update "Milestone #1" --title milestone-1', 'Will rename all milestones named "Milestone #1" to "milestone-1"')
    .argv;

if (!argv._[0]) {
    yargs.showHelp();
    process.exit(1);
}
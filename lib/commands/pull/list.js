const ProgressBar = require('progress');
const colors = require('colors');
const auth = require('../../auth');
const log = require('../../log');

const BULK_SIZE = 20;

module.exports.command = 'list';

module.exports.describe = 'List pull-requests in all your repositories';

module.exports.builder = {
    state: {
        alias: 's',
        type: 'state',
        choices: ['all', 'open', 'closed'],
        describe: 'state of the milestone'
    }
};

module.exports.handler = async function(argv) {
    const { github, repos, hydratePulls } = await auth.init();
    await hydratePulls(repos, argv.state);

    if (!repos.length) return;

    for (let repo of repos) {
        if (!repo.pulls.length) continue;
        log.info(`${repo.owner}/${repo.name}`);
        for (let p of repo.pulls) {
            const color = {
                open: colors.green,
                closed: colors.gray
            }[p.state];
            console.log(`• ${p.number}: ${color(p.title)} by @${color(p.author)} (${color(p.state)})`);
        }
    }
};

const ProgressBar = require('progress');
const colors = require('colors');
const auth = require('../../auth');
const log = require('../../log');

module.exports.command = 'list';

module.exports.describe = 'List milestones in all your repositories';

module.exports.builder = {
    state: {
        alias: 's',
        type: 'state',
        choices: ['all', 'open', 'closed'],
        describe: 'state of the milestone'
    }
};

module.exports.handler = async function(argv) {
    const { github, repos, hydrateMilestones, filterMilestones } = await auth.init();
    await hydrateMilestones(repos, argv.state);

    if (!repos.length) return;

    for (let repo of repos) {
        if (!repo.milestones.length) continue;
        log.info(`${repo.owner}/${repo.name}`);
        for (let m of repo.milestones) {
            const color = {
                open: colors.green,
                closed: colors.gray
            }[m.state];
            console.log(`• ${m.number}: ${color(m.title)} (${color(m.state)})`);
        }
    }
};
const ProgressBar = require('progress');
const colors = require('colors');
const auth = require('../../auth');
const log = require('../../log');

module.exports.command = 'create [milestone]';

module.exports.describe = 'Create a new milestone in multiple repositories';

module.exports.builder = {
    description: {
        type: 'string',
        describe: 'description of the milestone'
    },
    due: {
        alias: 'd',
        type: 'string',
        describe: 'milestone\'s due date. format: YYYY-MM-DD'
    }
};

module.exports.handler = async function(argv) {
    const { github, repos } = await auth.init();

    log.info(`Creating milestones...`);
    const progress = new ProgressBar(':current/:total [:bar]', { total: repos.length });
    for (let repo of repos) {
        await github.issues.createMilestone({
            owner: repo.owner,
            repo: repo.name,
            title: argv.milestone,
            description: argv.description,
            due_on: argv.due || getDefaultDue()
        });
        progress.tick();
    }

    log.success(`Done.`);
};

function getDefaultDue() {
    var now = new Date();
    now.setDate(now.getDate() + 14);
    return now.toISOString();
}

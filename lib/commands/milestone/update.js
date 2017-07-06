const ProgressBar = require('progress');
const auth = require('../../auth');
const log = require('../../log');

module.exports.command = 'update [milestone]';

module.exports.describe = 'Update milestone';

module.exports.builder = {
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
};

module.exports.handler = async function(argv) {
    const { github, repos, hydrateMilestones, filterMilestones } = await auth.init();
    await hydrateMilestones(repos, argv.force ? 'all' : 'open');
    const milestones = await filterMilestones(repos, argv.milestone);
    if (!milestones.length) return;

    log.info(`Updating milestones...`);
    const progress = new ProgressBar(':current/:total [:bar]', { total: milestones.length });
    const updates = {};
    if (argv.due) updates.due_on = argv.due;
    if (argv.title) updates.title = argv.title;

    for (let milestone of milestones) {
        await github.issues.updateMilestone(Object.assign({
            owner: milestone.repo.owner,
            repo: milestone.repo.name,
            number: milestone.number,
            title: milestone.title
        }, updates));
        progress.tick();
    }

    log.success(`Done.`);
};

const ProgressBar = require('progress');
const auth = require('../auth');
const log = require('../log');

module.exports = async function(argv) {
    const { github, repos, hydrateMilestones, filterMilestones } = await auth.init();
    await hydrateMilestones(repos, argv.force ? 'all' : 'open');
    const milestones = await filterMilestones(repos, argv.milestone);
    if (!milestones.length) return;

    log.info(`Updating milestones...`);
    const progress = new ProgressBar(':current/:total [:bar]', { total: milestones.length });
    const updates = { title: argv.title || milestone.title };
    if (argv.due) updates.due_on = argv.due;

    for (let milestone of milestones) {
        await github.issues.updateMilestone(Object.assign({
            owner: milestone.repo.owner,
            repo: milestone.repo.name,
            number: milestone.number
        }, updates));
        progress.tick();
    }

    log.success(`Done.`);
}
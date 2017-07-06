const ProgressBar = require('progress');
const auth = require('../../auth');
const log = require('../../log');

module.exports.command = 'delete [milestone]';

module.exports.describe = 'Permanently delete a milestone a milestone (see `close` to update milestone status)';

module.exports.handler = async function(argv) {
    const { github, repos, hydrateMilestones, filterMilestones } = await auth.init();
    await hydrateMilestones(repos, 'all');
    const milestones = await filterMilestones(repos, argv.milestone);
    if (!milestones.length) return;

    log.info(`Deleting milestones...`);
    const progress = new ProgressBar(':current/:total [:bar]', { total: milestones.length });

    for (let milestone of milestones) {
        await github.issues.deleteMilestone({
            owner: milestone.repo.owner,
            repo: milestone.repo.name,
            number: milestone.number
        });
        progress.tick();
    }

    log.success(`Done.`);
};

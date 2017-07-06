const ProgressBar = require('progress');
const auth = require('../../auth');
const log = require('../../log');

module.exports = state => {
    return async function (argv) {
        try {
            const { github, repos, hydrateMilestones, filterMilestones } = await auth.init();
            await hydrateMilestones(repos, state === 'open' ? 'closed' : 'open');
            const milestones = await filterMilestones(repos, argv.milestone);
            if (!milestones.length) return;

            log.info(`Changing status to ${state}...`);
            const progress = new ProgressBar(':current/:total [:bar]', { total: milestones.length });

            for (let milestone of milestones) {
                await github.issues.updateMilestone({
                    owner: milestone.repo.owner,
                    repo: milestone.repo.name,
                    number: milestone.number,
                    title: milestone.title,
                    state
                });
                progress.tick();
            }

            log.success(`Done.`);
        } catch (err) {
            log.error(err.message);
        }
    }
}
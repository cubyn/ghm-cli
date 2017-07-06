const Github = require('github');
const os = require('os');
const { existsSync, writeFileSync } = require('fs');
const { join } = require('path');
const ProgressBar = require('progress');
const log = require('./log');

const PREFERENCE_FILENAME = '.ghm.json';
const BULK_SIZE = 20;

function readPreferences() {
    const path = join(os.homedir(), PREFERENCE_FILENAME);
    if (existsSync(path)) {
        return require(path);
    }
    log.error(`No ${path} found. Please run "ghm login" first.`);
    process.exit(1);
}

function savePreferences(preferences) {
    const path = join(os.homedir(), PREFERENCE_FILENAME);
    let old;
    if (existsSync(path)) {
        old = require(path);
    } else {
        old = {};
    }
    Object.assign(old, preferences);
    writeFileSync(path, JSON.stringify(old, null, 2));
    log.success(`Saved in ${path}.`);
    process.exit(1);
}

function getGithub(data) {
    const github = new Github();
    github.authenticate(data);
    return github;
}

async function getRepos(github, preferences) {
    const { org, ignore } = preferences;
    log.info('Loading repositories...');
    const response = await github.repos.getForOrg({
        org,
        per_page: 100
    });
    const repos = response.data
        .reduce((memo, repo) => {
            const ignored = ignore && ignore.includes(repo.full_name);
            if (!ignored) {
                memo.push({
                    owner: repo.owner.login,
                    name: repo.name
                });
            }
            return memo;
        }, [])
        .sort();
    log.success(`${repos.length} repositories found.`);
    return repos;
}

function hydrateMilestones(github) {
    return async function (repos, state = 'open') {
        log.info('Loading milestones...');
        const progress = new ProgressBar(':current/:total [:bar]', { total: repos.length });
        let count = 0;
        for (let i = 0; i < repos.length / BULK_SIZE; i++) {
            let scope = repos.slice(i * BULK_SIZE, Math.min((1 + i) * BULK_SIZE));
            await Promise.all(scope.map(async repo => {
                let response = await github.issues.getMilestones({
                    owner: repo.owner,
                    repo: repo.name,
                    state
                });
                if (response.data) {
                    count += response.data.length;
                    repo.milestones = response.data
                        .map(m => {
                            return {
                                id: m.id,
                                number: m.number,
                                title: m.title.trim(),
                                state: m.state
                            };
                        })
                        .sort(sortByNumber)
                }
                progress.tick();
            }));
        }
        log.success(`${count} total milestones found.`);
    };
}

function sortByNumber(m1, m2) {
    return m2.number - m1.number;
}

function filterMilestones(repos, title) {
    const result = [];
    log.info('Searching milestones...');
    title = title.trim();
    for (let repo of repos) {
        if (!repo.milestones) continue;
        for (let milestone of repo.milestones) {
            if (milestone.title === title) {
                const m = Object.assign({}, milestone);
                m.repo = {
                    owner: repo.owner,
                    name: repo.name
                };
                result.push(m);
            }
        }
    }
    log.success(`${result.length} milestones matched ${title}.`);
    return result;
}

module.exports = {
    init: async function () {
        const preferences = readPreferences();
        const github = getGithub({
            type: 'token',
            token: preferences.token
        });
        const repos = await getRepos(github, preferences);
        return {
            preferences,
            github,
            repos,
            hydrateMilestones: hydrateMilestones(github),
            filterMilestones
        };
    },
    save: savePreferences,
    getGithub
};

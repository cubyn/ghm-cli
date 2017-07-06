const ProgressBar = require('progress');
const os = require('os');
const auth = require('../auth');
const log = require('../log');
const prompt = require('prompt-promise');

module.exports.command = 'login';

module.exports.describe = 'Login to Github (no password ever stored)';

module.exports.handler = async function(argv) {
    const org = await prompt('Github organization: ');
    const username = await prompt('Github username: ');
    const password = await prompt.password('Github password: ');
    const github = auth.getGithub({
        type: 'basic',
        username,
        password
    });
    const options = {
        scopes: ['repo', 'public_repo'],
        note: `cubyn/ghm for ${os.hostname()}`,
        note_url: 'https://github.com/cubyn/ghm'
    };
    try {
        const response = await github.authorization.create(options);
        auth.save({ token: response.data.token, org });
    } catch (err) {
        log.error('Could not create an access token. Check your credentials or delete any prior token in https://github.com/settings/tokens .');
    }
};
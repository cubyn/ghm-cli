const auth = require('../auth');
const log = require('../log');

module.exports.command = 'clean';

module.exports.describe = 'Clean all GHM cache';

module.exports.handler = async function(argv) {
    const preferences = auth.read();
    delete preferences.cache;
    auth.save(preferences);
    log.info('Cache clean');
};
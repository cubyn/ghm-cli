const changeStatus = require('./change-status');

module.exports.command = 'open [milestone]';

module.exports.describe = 'Re-open milestone';

module.exports.handler = changeStatus('open');

const changeStatus = require('./change-status');

module.exports.command = 'close [milestone]';

module.exports.describe = 'Close milestone';

module.exports.handler = changeStatus('closed');

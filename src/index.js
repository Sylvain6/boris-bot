const config = require('./config');

const { TwitterBot } = require('./services/dm-service');

const borisBot = new TwitterBot(config.twitter);
console.log('hello');
borisBot.subscribe();
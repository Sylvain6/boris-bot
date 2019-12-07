const bannedWords = require('./banned-word');
const requiredWords = require('./required-word');
const wantedWords = require('./wanted-word');
const contains = require('./contains');

module.exports = {
    bannedWords,
    requiredWords,
    wantedWords,
    contains
}
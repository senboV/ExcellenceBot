// holds an in-memory copy of all the bot configurations so that frequent trips to the DB don't need to occur
// ensures that changes to these configurations are sent down to the DB immediately to keep them in sync
const databaseHelper = require('./databaseHelper.js');

var channelId = null;
var threshold = null;
var reactionEmoji = null;
var embedEmoji = null;

// If there is no value, go to the DB and find it, otherwise return what is known
const getChannelId = async () => {
    if (channelId === null) {
        console.log('Retreiving Channel Id from Database');
        const channelIdRow = await databaseHelper.getSetting(databaseHelper.channel);
        channelId = channelIdRow.value;
    }
    return channelId;
}

// Store a new value to the DB, and update the one in memory
const setChannelId = (newChannelId) => {
    channelId = newChannelId;
    return databaseHelper.updateSetting(databaseHelper.channel, newChannelId);
}

const getThreshold = async () => {
    if (threshold === null) {
        console.log('Retreiving Threshold from Database');
        const thresholdRow = await databaseHelper.getSetting(databaseHelper.threshold);
        threshold = thresholdRow.value;
    }
    return threshold;
}

const setThreshold = async (newThreshold) => {
    threshold = newThreshold;
    console.log(`threshold: ${threshold}`);
    return databaseHelper.updateSetting(databaseHelper.threshold, newThreshold);
}

const getReactionEmoji = async () => {
    if (reactionEmoji === null) {
        console.log('Retreiving Reaction Emoji String from Database');
        const emojiRow = await databaseHelper.getSetting(databaseHelper.reactionEmoji);
        reactionEmoji = emojiRow.value;
    }
    return reactionEmoji;
}

const setReactionEmoji = async (newEmoji) => {
    reactionEmoji = newEmoji;
    return databaseHelper.updateSetting(databaseHelper.reactionEmoji, newEmoji);
}

const getEmbedEmoji = async () => {
    if (embedEmoji === null) {
        console.log('Retreiving Embed Emoji String from Database');
        const emojiRow = await databaseHelper.getSetting(databaseHelper.embedEmoji);
        embedEmoji = emojiRow.value;
    }
    return embedEmoji;
}

const setEmbedEmoji = async (newEmoji) => {
    embedEmoji = newEmoji;
    return databaseHelper.updateSetting(databaseHelper.embedEmoji, newEmoji);
}

module.exports = {
    getChannelId,
    setChannelId,
    getThreshold,
    setThreshold,
    getReactionEmoji,
    setReactionEmoji,
    getEmbedEmoji,
    setEmbedEmoji,
}
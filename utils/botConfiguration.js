// holds an in-memory copy of all the bot configurations so that frequent trips to the DB don't need to occur
// ensures that changes to these configurations are sent down to the DB immediately to keep them in sync
const databaseHelper = require('./databaseHelper.js');

var channelId = null;
var threshold = null;
var emoji = null;

// If there is no value, go to the DB and find it, otherwise return what is known
const getChannelId = async () => {
    if (channelId === null) {
        console.log('Retreiving Channel Id from Database');
        channelId = await databaseHelper.getSetting(databaseHelper.channel);
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
        threshold = await databaseHelper.getSetting(databaseHelper.threshold);
    }
    return threshold;
}

const setThreshold = async (newThreshold) => {
    threshold = newThreshold;
    console.log(`threshold: ${threshold}`);
    return databaseHelper.updateSetting(databaseHelper.threshold, newThreshold);
}

const getEmoji = async () => {
    if (emoji === null) {
        console.log('Retreiving Emoji String from Database');
        emoji = await databaseHelper.getSetting(databaseHelper.emoji);
    }
    return emoji;
}

const setEmoji = async (newEmoji) => {
    emoji = newEmoji;
    return databaseHelper.updateSetting(databaseHelper.emoji, newEmoji);
}

module.exports = {
    getChannelId,
    setChannelId,
    getThreshold,
    setThreshold,
    getEmoji,
    setEmoji,
}
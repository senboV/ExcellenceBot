const Sequelize = require('sequelize');
const dotenv = require('dotenv');

// Configure dotenv to load the environment variables from the .env file
dotenv.config();

// Default Database connection object
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_ENDPOINT,
    dialect: 'postgres',
    logging: false,
});

// imported Database Models, using the existing database connection
// TODO: Move path strings to config file or env so that they all get edited in one place
const BotSettings = require('../models/setting.js')(sequelize, Sequelize.DataTypes);
const ExcelPosts = require('../models/excellencePost.js')(sequelize, Sequelize.DataTypes);

// Database table name constants
const channel = "channel";
const threshold = "threshold";
const reactionEmoji = "reactionEmoji";
const embedEmoji = "embedEmoji";

// Create a default database
const initializeDb = (force) => {
    sequelize.sync({ force }).then(async () => {
        const settings = [
            BotSettings.upsert({ name: channel, value: '1215090521895346206' }),
            BotSettings.upsert({ name: threshold, value: '1' }),
            BotSettings.upsert({ name: reactionEmoji, value: '<:ex:1215067433413382206>' }),
            BotSettings.upsert({ name: embedEmoji, value: '⭐' }),
        ];

        await Promise.all(settings);
        console.log('Database Synced');

        sequelize.close();
    }).catch(console.error);
}

// add new setting
const addSetting = async (name, value) => {
    return BotSettings.create({ name: name, value: value });
}

// get specific setting
const getSetting = async (name) => {
    return BotSettings.findByPk(name);
}

// Get ALL settings
const getAllSettings = () => {
    return BotSettings.findAll();
}

// upsert a setting
const updateSetting = async (name, value) => {
    return BotSettings.upsert({ name: name, value: value });
}

// remove setting
const removeSetting = async (name) => {
    return BotSettings.destroy({
        where: {
            name: name
        }
    });
}

// add new post
const addPost = async (guildId, channelId, messageId, embedId) => {
    return ExcelPosts.create({ guild_id: guildId, channel_id: channelId, message_id: messageId, embed_id: embedId });
}

// get specific Embeded Excellence Post
const getPost = async (guildId, channelId, messageId) => {
    // For composite PKs, which is how Excel Posts are stored (GuildId+ChannelId+MessageId)
    return ExcelPosts.findOne({
        where: {
            guild_id: guildId,
            channel_id: channelId,
            message_id: messageId,
        }
    });
}

// update existing post
const updatePost = async (guildId, channelId, messageId, embedId) => {
    return ExcelPosts.upsert({ guild_id: guildId, channel_id: channelId, message_id: messageId, embed_id: embedId });
}

// remove post
const removePost = async (guildId, channelId, messageId) => {
    return ExcelPosts.destroy({
        where: {
            guild_id: guildId,
            channel_id: channelId,
            message_id: messageId,
        }
    });
}

module.exports = {
    channel,
    threshold,
    reactionEmoji,
    embedEmoji,
    initializeDb,
    addSetting,
    getSetting,
    getAllSettings,
    updateSetting,
    removeSetting,
    addPost,
    getPost,
    updatePost,
    removePost,
}
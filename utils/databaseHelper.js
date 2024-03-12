const Sequelize = require('sequelize');

// Default Database connection object
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

// imported Database Models, using the existing database connection
// TODO: Move path strings to config file or env so that they all get edited in one place
const BotSettings = require('../models/setting.js')(sequelize, Sequelize.DataTypes);
const ExcelPosts = require('../models/excellencePost.js')(sequelize, Sequelize.DataTypes);

// Database table name constants
const channel = "channel";
const threshold = "threshold";
const emoji = "emoji";

// Create a default database
const initializeDb = (force) => {
    sequelize.sync({ force }).then(async () => {
        const settings = [
            BotSettings.upsert({ name: channel, value: null }),
            BotSettings.upsert({ name: emoji, value: '123456789' }),
            BotSettings.upsert({ name: threshold, value: '1' }),
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
const addPost = async (messageId, guildId, embedId) => {
    return ExcelPosts.create({ guild_id: guildId, message_id: messageId, embed_id: embedId });
}

// get specific Embeded Excellence Post
const getPost = async (messageId, guildId) => {
    // For composite PKs, which is how Excel Posts are stored (GuildId+MessageId)
    return ExcelPosts.findOne({
        where: {
            guild_id: guildId,
            message_id: messageId,
        }
    });
}

// update existing post
const updatePost = async (messageId, guildId, embedId) => {
    return ExcelPosts.upsert({ guild_id: guildId, message_id: messageId, embed_id: embedId });
}

// remove post
const removePost = async (messageId, guildId) => {
    return ExcelPosts.destroy({
        where: {
            guild_id: guildId,
            message_id: messageId,
        }
    });
}

module.exports = {
    channel,
    threshold,
    emoji,
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
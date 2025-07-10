const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const botConfiguration = require('../utils/botConfiguration.js');
const boardPoster = require('../utils/boardPoster.js');
const databaseHelper = require('../utils/databaseHelper.js');

const argumentName = 'message_url';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('force_post')
        .setDescription('Forces the bot to make a post of a given message, regardless of reactions.')
        .addChannelOption(option =>
            option.setName(argumentName)
                .setDescription('The full message url for the desired parent message.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const messageUrl = interaction.options.getString(argumentName);
        await interaction.reply({ content: `Forcing Embed Post from message: ${messageUrl}`, flags: MessageFlags.Ephemeral });
        // regex to extract guild, channel, and message ID from the url?
        // interaction -> message object from IDs -> force post

    }
}
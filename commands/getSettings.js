const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const botConfiguration = require('../utils/botConfiguration.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_settings')
        .setDescription('Returns all of the configurable settings for the bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const channel = await botConfiguration.getChannelId();
        const threshold = await botConfiguration.getThreshold();
        const reactionEmoji = await botConfiguration.getReactionEmoji();
        const embedEmoji = await botConfiguration.getEmbedEmoji();
        await interaction.reply({ content: `All Bot Settings:\nChannel: ${channel}\nThreshold: ${threshold}\nReaction Emoji: ${reactionEmoji}\nEmbed Emoji: ${embedEmoji}`, flags: MessageFlags.Ephemeral });
    }
} 
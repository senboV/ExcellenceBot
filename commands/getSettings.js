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
        const emoji = await botConfiguration.getEmoji();
        await interaction.reply({ content: `All Bot Settings:\nThreshold: ${threshold}\nEmoji: ${emoji}\nChannel: ${channel}`, ephemeral: true });
    }
} 
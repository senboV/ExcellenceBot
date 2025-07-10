const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const botConfiguration = require('../utils/botConfiguration.js');

const argumentName = 'channel';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_channel')
        .setDescription('Selects the channel for the bot to create Embed posts in.')
        .addChannelOption(option =>
            option.setName(argumentName)
                .setDescription('The specific channel in the server for the Bot to post Excellence Embeds to.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const newChannel = interaction.options.getChannel(argumentName);
        await interaction.reply({ content: `Setting Embed Post Channel to: ${newChannel.name}`, flags: MessageFlags.Ephemeral });
        botConfiguration.setChannelId(newChannel.id);
    }
}
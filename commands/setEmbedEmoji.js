const { SlashCommandBuilder, PermissionFlagsBits, parseResponse, parseEmoji, MessageFlags } = require('discord.js');
const botConfiguration = require('../utils/botConfiguration.js');

const argumentName = 'emoji';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_embed_emoji')
        .setDescription('Sets the emoji the bot will use in the embed post to count reactions.')
        .addStringOption(option =>
            option.setName(argumentName)
                .setDescription('Which emoji the bot should use in the embed. Currently only default, non-custom, emojis work.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const emojiString = interaction.options.getString(argumentName);
        await interaction.reply({ content: `Setting Embed Emoji to: ${emojiString}`, flags: MessageFlags.Ephemeral });
        botConfiguration.setEmbedEmoji(emojiString);
    }
}
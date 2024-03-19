const { SlashCommandBuilder, PermissionFlagsBits, parseResponse, parseEmoji } = require('discord.js');
const botConfiguration = require('../utils/botConfiguration.js');

const argumentName = 'emoji';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_reaction_emoji')
        .setDescription('Sets the emoji for the bot to watch for and count.')
        .addStringOption(option =>
            option.setName(argumentName)
                .setDescription('Which emoji the bot should be looking for and counting.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const emojiString = interaction.options.getString(argumentName);
        await interaction.reply({ content: `Setting Reaction Emoji to: ${emojiString}`, ephemeral: true });
        botConfiguration.setReactionEmoji(emojiString);
    }
}
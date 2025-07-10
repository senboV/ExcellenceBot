const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const botConfiguration = require('../utils/botConfiguration.js');

const argumentName = 'threshold';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_threshold')
        .setDescription('Sets the threshold required for the bot to create a new Embed post.')
        .addIntegerOption(option =>
            option.setName(argumentName)
                .setDescription('The Integer value to set the threshold to.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const newThreshold = interaction.options.getInteger(argumentName);
        await interaction.reply({ content: `Setting Threshold to: ${newThreshold}`, flags: MessageFlags.Ephemeral });
        botConfiguration.setThreshold(newThreshold);
    }
}
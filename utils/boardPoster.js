const { EmbedBuilder, messageLink } = require('discord.js');
const botConfiguration = require('./botConfiguration.js');

/** 
 * Full Embeds should include:
 * - Original Message Content
 * - empty line
 * - link to original message
 * - link to attachment of any media
 * - preview of any media
 * - footer of emote count - Timestamp
 * And descriptions should handle the first 4 lines
 */

// Returns a formatted string that will be used to standardize the description content in an Embed
function formatDescription(messageReaction, attachment) {
	var description = `${messageReaction.message.content}`;
	description += `\n\nOriginal message: ${messageLink(messageReaction.message.channelId, messageReaction.message.id)}`;
	// check for media content
	if (attachment) {
		description += `\nFile: [${attachment.name}](${attachment.url})`;
	}
	return description;
}

// Returns null or the only Attachment to be used in an Embed
// TODO: This if statement looks like shit, probably a better way to write it
// TODO: handle stickers, gifs, and videos
function getAttachment(messageReaction) {
	// check for media content
	if (!messageReaction.message.attachments) {
		console.log("messageReaction has no attachments");
	} else if (messageReaction.message.attachments.firstKey() === messageReaction.message.attachments.lastKey()) {
		console.log("messageReaction has 1 attachment");
		return messageReaction.message.attachments.first();
	}
	// Message has > 1 attachment, we should ignore cuz it'll be a pain to format multiple uncountable attachments
	return null;
}

const createEmbed = async (messageReaction, user) => {
	const attachment = getAttachment(messageReaction);
	const description = formatDescription(messageReaction, attachment);
	// Somehow this works?
	const emoji = await botConfiguration.getEmoji();
	// TODO: Find a way to have the emoji actually show up in the footer when it's a custom emoji
	// TODO: ensure the user is actually the user that sent the message and not merely the user making the reaction
	var embed = new EmbedBuilder()
		.setColor(0xFF9327)
		.setAuthor({ name: user.displayName, iconURL: user.avatarURL(), url: messageReaction.message.url })
		.setDescription(description)
		.setFooter({ text: `${messageReaction.count}x ${emoji.value}` })
		.setTimestamp();
	if (attachment) {
		embed.setImage(attachment.url)
	}
	return embed;
}

// This feels so dumb. Please just let me grab the existing embed object and modify certain parts, then do the message.edit
const editEmbed = async (messageReaction, user, excellencePost) => {
	var embed = await createEmbed(messageReaction, user);
	const channelId = await botConfiguration.getChannelId();
	const channel = user.client.channels.cache.get(channelId.value);
	const existingEmbed = await channel.messages.fetch(excellencePost.embed_id);
	return existingEmbed.edit({ embeds: [embed] });
}

const postEmbed = async (messageReaction, user) => {
	var embed = await createEmbed(messageReaction, user);
	const channelId = await botConfiguration.getChannelId();
	const channel = user.client.channels.cache.get(channelId.value);
	return channel.send({ embeds: [embed] });
}

module.exports = {
	editEmbed,
	postEmbed,
}

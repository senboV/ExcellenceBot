const { EmbedBuilder, messageLink } = require('discord.js');
const botConfiguration = require('./botConfiguration.js');

/** 
 * Embed Format should follow:
 * - Original Message Reply-Parent + a new line
 * - Original Message Content
 * - 2x new lines 
 * - hyperlink to original message
 * - newline + hyperlink to attachment of any media
 * - preview of any media (gif, image, or video thumbnail)
 * - footer with emote count and Timestamp
 */

const createNewEmbed = async (messageReaction) => {
	const originalMessage = messageReaction.message;
	var embedContent = {
		description: '',
		imageUrls: [],
	}

	// Was the original message a reply to another message? If so, append that information to the final description
	if (originalMessage.reference?.messageId) {
		await originalMessage.channel.messages.fetch(originalMessage.reference.messageId)
			.then(message => {
				var replyContent = (!message.content && message.attachments.size) ? message.attachments.first().name : message.content.replace(/\n/g, ' ');
				replyContent = (replyContent.length > 300) ? `${replyContent.substring(0, 300)}...` : replyContent;
				embedContent.description = `> ${originalMessage.mentions.repliedUser}: ${replyContent}\n\n`;
			})
			.catch(err => {
				console.error(`Error while fetching message reply reference: ${err}`);
			});
	}

	// Append the original message content to the final description
	embedContent.description += originalMessage.content;
	embedContent.description += `\n\nOriginal message: ${messageLink(originalMessage.channelId, originalMessage.id)}`;

	// Iterate through all of the original message embeds and collect them
	if (originalMessage.embeds.length) {
		// Create an array of all the image and video-thumbnail embeds in the original message
		const images = originalMessage.embeds
			.filter(embed => embed.thumbnail || embed.image)
			.map(embed => (embed.thumbnail) ? embed.thumbnail.url : embed.image.url);
		if (images.length) {
			// regex replace certain parts of common GIF urls
			images.forEach((url, i) => {
				images[i] = images[i].replace(/(^https:\/\/media.tenor.com\/.*)(AAAAe\/)(.*)(\.png|\.jpg)/, "$1AAAAC/$3.gif");
			});
			embedContent.imageUrls = images;
		}
		// Check for a bot-posted embed
		if (originalMessage.content === '') {
			const botEmbed = originalMessage.embeds[0];
			if (botEmbed.description) {
				embedContent.description += botEmbed.description;
			} else if (botEmbed.fields && botEmbed.fields[0].value) {
				embedContent.description += botEmbed.fields[0].value;
			}
		}
	}

	// Iterate through all of the original message attachments and collect them
	if (originalMessage.attachments.size) {
		originalMessage.attachments.each(attachment => {
			embedContent.imageUrls.push(attachment.url);
			embedContent.description += `\nFile: [${attachment.name}](${attachment.url})`;
		});
	}

	// Stickers? Gif stickers aren't animated so it's w/e, I don't think this'll be that popular of a reaction
	if (originalMessage.stickers.size) {
		originalMessage.stickers.each(sticker => {
			embedContent.imageUrls.push(sticker.url);
		});
	}

	// TODO: I'm pretty sure video embeds are impossible for the embed builder so this is just a placeholder if it ever becomes possible


	// We can use a common url to attach all images of any message to a single Embed
	const firstImageUrl = (embedContent.imageUrls.length) ? embedContent.imageUrls.shift() : null;
	// Use the previously collected information to actually build a proper embed object
	// TODO: Find a way to have the emoji actually show up in the footer when it's a custom emoji. Current workaround is to use a setting and have it be a generic emoji for now
	var allEmbeds = [
		new EmbedBuilder()
			.setURL(firstImageUrl)
			.setColor(0xFF9327)
			.setAuthor({ name: originalMessage.author.displayName, iconURL: originalMessage.author.avatarURL(), url: messageReaction.message.url })
			.setDescription(embedContent.description)
			.setImage(firstImageUrl)
			.setFooter({ text: `${messageReaction.count}x ${messageReaction.emoji}` })
			.setTimestamp()
	];
	embedContent.imageUrls.forEach(url => {
		allEmbeds.push(new EmbedBuilder().setURL(firstImageUrl).setImage(url));
	})

	return allEmbeds;

}

// This feels so dumb. Please just let me grab the existing embed object and modify certain parts, then do the message.edit
const editEmbed = async (messageReaction, user, excellencePost) => {
	var embeds = await createNewEmbed(messageReaction);
	const channelId = await botConfiguration.getChannelId();
	const channel = user.client.channels.cache.get(channelId);
	const existingEmbed = await channel.messages.fetch(excellencePost.embed_id);
	return existingEmbed.edit({ embeds: embeds });
}

const postEmbed = async (messageReaction, user) => {
	var embeds = await createNewEmbed(messageReaction);
	const channelId = await botConfiguration.getChannelId();
	const channel = user.client.channels.cache.get(channelId);
	return channel.send({ embeds: embeds });
}

module.exports = {
	editEmbed,
	postEmbed,
}

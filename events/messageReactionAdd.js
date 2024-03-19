const { Events } = require('discord.js');
const boardPoster = require('../utils/boardPoster.js');
const botConfiguration = require('../utils/botConfiguration.js');
const databaseHelper = require('../utils/databaseHelper.js');

const postExcellenceEmbed = async (messageReaction, user) => {
	const emojiString = await botConfiguration.getReactionEmoji();
	const threshold = await botConfiguration.getThreshold();

	// Ensure that the message has the correct reaction with a count higher than the threshold
	if (messageReaction.emoji.toString() === emojiString) {
		if (messageReaction.count >= threshold) {
			const embedMessageId = await databaseHelper.getPost(messageReaction.message.id, messageReaction.message.guildId);
			//If an embed post doesn't exist for the message, create a new one, otherwise edit the existing one
			if (embedMessageId === null) {
				const newEmbedMessage = await boardPoster.postEmbed(messageReaction, user);
				return databaseHelper.addPost(messageReaction.message.id, messageReaction.message.guildId, newEmbedMessage.id);
			} else {
				// edit an existing embed
				return boardPoster.editEmbed(messageReaction, user, embedMessageId);
			}
		}
	}
}

module.exports = {
	name: Events.MessageReactionAdd,
	execute(messageReaction, user) {
		// It's likely that the message that triggered this event isn't cached, so we need to fetch all the data we can
		if (messageReaction.partial) {
			console.log("Fetching full message reaction...");
			messageReaction.fetch()
				.then(fullMessageReaction => {
					postExcellenceEmbed(fullMessageReaction, user);
				})
				.catch(error => {
					console.log('Something went wrong when fetching the message: ', error);
				});
		} else {
			postExcellenceEmbed(messageReaction, user);
		}
	},
};
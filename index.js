// Import the necessary classes from discord.js library
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
// allows access to global environment variables
const dotenv = require('dotenv');
const filesys = require('node:fs');
const path = require('node:path');

// Configure dotenv to load the environment variables from the .env file
dotenv.config();

/**
 * Instantiate a new Client to process the bots functionality.
 * A "Guild" is equivalent to what it usually known as a "Discord Server"
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

/**
 * Creat a collection of Commands that should already be registered with Discord
 * Key-> Command Name
 * Value -> Function to execute when given the command
 */
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = filesys.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    // Create final filepaths from combination the full path and individual files
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

/**
 * Setup Event Handlers based on the defined handlers in ./events
 */
const eventsPath = path.join(__dirname, 'events');
const eventFiles = filesys.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

/**
 * Bot Logic 
 * awake when any reaction is done on the server (that isnt from the bot or on a message by the bot) with the corresponding emoji (add only)
 * count how many times that message has the emoji
 * if it's over a threshold, 
 *   if there is already an embed post of that message
 *     edit the embed post and update the count of emoji
 *   else 
 *     create a new embed post with information from that message
 * 
 * additional features
 * - restrict commands to specific roles
 * - select threshold value
 * - select emoji
 * - select channel
 * - update embed when message gets edited?
 * - modify to run off of a server with API endpoints so that my personal computer doesn't need to be on 24/7
 * 
 * Need a Database to store (sqlite)
 * - Excellence Posts (Key: original message Id, Value: Embed message Id)
 *   - Scale up, needs to be a bit more -> Guild Id + Channel Id + Message Id -> Embed Id
 * - Various configurable bot-settings (Key: setting name, Value: setting value)
 */

/** 
 * TODO: Various improvements -> 
 * date range
 * max length messages
 * time buffer between first post/editing and additional reactions (grace period)
 * embed color as setting?
 * admin command: force an embed on a specific post
 * admin command: delete an existing embed
 * admin command: mark message as exempt
 * handle other reaction events: purge (all and single), and remove
 */

/** 
 * Log in the bot with the token from the environment variables and handle potential login errors
 */ 
client.login(process.env.DISCORD_TOKEN).catch((err) => {
    console.error(`Error logging in: ${err}`);
});

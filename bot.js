require('dotenv').config();
const antispam = require("./antispam.js")
const logger = require('pino')();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        logger.info(`${interaction.author.id} initiated the ping command.`);
        await interaction.reply(
            `${Date.now()-interaction.createdTimestamp} milliseconds.`);
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // ignore bot messages
    logger.info({ 
        messageAuthorUsername: message.author.username,
        messageAuthorID: message.author.id,
        messageContent: message.content,
        messageStatus: 'created'
    });
    if (antispam.isSpam(message)) {
        try {
            await message.delete();
            logger.info({ 
                messageAuthorUsername: message.author.username,
                messageAuthorID: message.author.id,
                messageContent: message.content,
                messageStatus: 'deleted'
            }, "Deleted due to anti-spam protection.");
        } catch (e) {
            console.error(e);
        }
    }
});

client.login(process.env.BOT_TOKEN);
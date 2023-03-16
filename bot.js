require('dotenv').config();
const antispam = require("./antispam.js")
const logger = require('pino')();
const { Client, GatewayIntentBits} = require('discord.js');
const client = new Client(
    {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
    }   
);

client.once('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach((guild) => {
        console.log(`Channels in ${guild.name}:`);
        
        // Loop through each channel in the guild
        guild.channels.cache.forEach((channel) => {
          console.log(` - ${channel.name} (${channel.type})`);
        });
      });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const isInAdminGroup = interaction.member.roles.cache.some(role => role.name === `${process.env.ADMIN_GROUP}`);
    const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
    const command = interaction.commandName;

    // log the attempt
    logger.info({
        interactionMemberUsername: interaction.member.username,
        interactionMemberID: interaction.member.id,
        isInAdminGroup: isInAdminGroup,
        isAdmin: isAdmin,
        commandName: command,
    }, "New interaction attempt.");

    if (command === 'ping') {
        await interaction.reply({
            content: `${Date.now() - interaction.createdTimestamp} milliseconds.`, ephemeral: true });
    }

    if (interaction.commandName === 'archive') {

        // Check if the user is an administrator or is in admin group
        console.log("checking to see if user is admin or in admin group")
        if (!isInAdminGroup && !isAdmin) {
            return await interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
        }

        const channel = interaction.channel;
        const archiveCategoryName = 'archive';

        // Find the archive category
        console.log("finding the archive category")
        const archiveCategory = channel.guild.channels.cache.find(c => c.name.toLowerCase() === archiveCategoryName && c.type === 4);
        if (!archiveCategory) {
            return await interaction.reply({content: 'Make sure the ARCHIVE category exists!', ephemeral: true });
        }

        // Move the channel to the archive category
        console.log("moving channel")
        await channel.setParent(archiveCategory.id);

        // Send a confirmation message
        console.log("sending confirmation reply")
        await interaction.reply({ content: `Channel ${channel.name} has been archived!`, ephemeral: true });
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
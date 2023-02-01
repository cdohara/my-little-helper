# My-Little-Helper

**My-Little-Helper** is a Discord bot written in Javascript. It uses
NodeJS and the following NPM packages:

- discord.js (to interact with the Discord API)
- pino (for logging)
- pino-rotating-file (to pipe stdout to a file with rotation)
- dotenv (for easy environment modification)

## Usage

The version of NodeJS used in development is `v19.5.0`
as of Feb 1, 2023.

To install all the required node_modules, use `npm install`. Then,
start the bot with `npm start`.

You may also use the PM2 global NodeJS package for easy persistence.

## Configuration

### The Environment File

The `.env` dot file contains the following:

```
BOT_TOKEN="The_string_that_is_your_bot_token"
GUILD_ID=the_numbers_that_is_your_guild
APPLICATION_ID=the_numbers_that_is_your_app_id
```

The Guild ID may be found by enabling developer mode on Discord and
right clicking a server.

The bot token and application ID may both be found in your
Discord developer portal.

Alternatively, you can also export the environment variables
system-wide and remove the dotenv dependency.
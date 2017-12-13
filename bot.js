const _ = require('lodash');
const Discord = require('discord.js');
const logger = require('winston');
const dotenv = require('dotenv/config');

// Configure logger.
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Load plugins.
const listPlugins = process.env.PLUGINS.split(',');
let plugins = {};
listPlugins.forEach(plugin => {
    plugins[plugin] = require('./plugins/' + plugin);
});

// Initialize.
const bot = new Discord.Client();

// Login bot.
bot.login(process.env.TOKEN).then(() => {
    logger.info('Logged in');
    if (process.env.BOTNAME) {
        bot.user.setUsername(process.env.BOTNAME);
    }
    if (process.env.BOTGAME) {
        bot.user.setGame(process.env.BOTGAME);
    }
    if (process.env.BOTAVATAR) {
        bot.user.setAvatar(process.env.BOTAVATAR);
    }
});

// Listen to ready.
bot.on('ready', () => {
    logger.info('Connected');
});

// Listen to errors.
bot.on('error', (m) => {
    logger.error(m);
});

// Listen to reconnect events.
bot.on('reconnecting', () => {
    logger.info('Reconnecting..');
});

// Listen to messages
bot.on('message', (message) => {
    // Loop through plugins and parse message
    _.forOwn(plugins, (plugin, pluginName) => {
        if (typeof plugin.parse !== 'undefined') {
            plugin.parse(bot, message);
        }
    });
});
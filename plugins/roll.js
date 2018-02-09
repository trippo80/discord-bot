/**
 * Slumpa plugin
 * @module plugins/slumpa
 * @author Hampus Nordin, https://github.com/hampusn
 */

const helpers = require('../lib/helpers');
const _ = require('lodash');

// configure defaults
const defaults = {
    "min": 0,
    "max": 100
};

// setup data object
let data = {
    roll: {}
};

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    /**
     * Parse incoming message
     */
    parse: (bot, message) => {
        // Get command name and arguments.
        const cmd = helpers.getCommand(message);
        const args = helpers.getCommandArguments(message);

        // Make sure we got a command and it's the one we want.
        if (! cmd || cmd !== 'slumpa') {
            return;
        }

        const [min = defaults.min, max = defaults.max] = (args[0] || '').split('-').map(x => parseInt(x) || undefined);
        const rolled = getRandomInt(min, max);

        message.channel.send(`<@!${message.author.id}> slumpade en ${rolled} av ${min === defaults.min ? max : min + '-' + max}.`);
    }
};
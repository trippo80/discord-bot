/**
 * Fika plugin
 * @module plugins/fika
 * @author Magnus Palm, https://github.com/trippo80
 */

const moment = require('moment');
const helpers = require('../lib/helpers');
const _ = require('lodash');

module.exports = {
    /**
     * Parse incoming message
     */
    parse: (bot, message) => {
        // Get command name and arguments.
        const cmd = helpers.getCommand(message);
        const args = helpers.getCommandArguments(message);

        // Make sure we got a command and it's the one we want.
        if (!cmd || cmd !== 'dansa') {
            return;
        }

        const currentTopic = message.channel.topic;
        const msg1 = '♪┏(°.°)┛┗(°.°)┓┗(°.°)┛┏(°.°)┓ ♪';
        const msg2 = '♪┗(°.°)┓┏(°.°)┛┏(°.°)┓┗(°.°)┛ ♪';
        let counter = 1;

        // Initiate.
        message.channel.setTopic(msg1);
        let looper = setInterval(function () {
            message.channel.setTopic(counter % 2 ? msg2 : msg1);
            counter++;
        }, 500);

        // Stop after 10 seconds
        setTimeout(function () {
            clearInterval(looper);

            // Restore topic.
            message.channel.setTopic(currentTopic);
        }, 10000);
    }
};
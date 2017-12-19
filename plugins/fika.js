const moment = require('moment');
const helpers = require('../lib/helpers');
const _ = require('lodash');

// setup data object
let data = {
    fika: {
        next: null,
        timer: null
    }
};

module.exports = {
    /**
     * Parse incoming message
     */
    parse: (bot, message) => {
        // Get command name and arguments.
        const cmd = helpers.getCommand(message);
        const args = helpers.getCommandArguments(message);

        // Make sure we got a command and it's the one we want.
        if (! cmd || cmd !== 'fika') {
            return;
        }

        // Did we get an argument?
        if (args[0]) {
            // Yes - convert to minutes.
            let minutes = parseInt(args[0]);
            if (! _.isInteger(minutes) || minutes < 0) {
                // Argument doesn't seem to be minutes.
                message.channel.send('<@!' + message.author.id + '> Förstod inte det där..');
                return;
            }

            // Save minutes and return message.
            data.fika.next = moment().add(minutes, 'm');
            message.channel.send('<@!' + message.author.id + '> Ok, fika om ' + minutes + ' minut(er)!');

            // Create timer
            data.fika.timer = setTimeout(function () {
                clearInterval(data.fika.interval);
                message.channel.send('@everyone Nu är det fika!!');
                data.fika.next = null;
                data.fika.timer = null;
            }, moment(data.fika.next).diff(moment(), 'ms'));

        } else {
            // No argument, do we have a next fika set?
            if (data.fika.next) {
                // Yes - calculate number of minutes until fika.
                let minutes = moment(data.fika.next).diff(moment(), 'm');

                // Make sure we haven't missed fika.
                if (minutes > 0) {
                    message.channel.send('<@!' + message.author.id + '> Fika om ' + minutes + ' minut(er)!');
                } else {
                    // We missed fika - reset and return a message.
                    data.fika.next = null;
                    message.channel.send('<@!' + message.author.id + '> Vet inte när nästa fika är :(');
                }
            } else {
                // No fika set - return message.
                message.channel.send('<@!' + message.author.id + '> Vet inte när nästa fika är :(');
            }
        }
    }
};
/**
 * Lunch plugin
 * @module plugins/lunch
 * @author Hampus Nordin, https://github.com/hampusn
 */

const moment = require('moment');
const helpers = require('../lib/helpers');
const _ = require('lodash');

// setup data object
let data = {
    lunch: {
        next: null,
        timer: null,
        place: null
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
        if (! cmd || cmd !== 'lunch') {
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

            data.lunch.place = (args[1] + '').trim() || null;

            // Save minutes and return message.
            data.lunch.next = moment().add(minutes, 'm');
            message.channel.send('<@!' + message.author.id + '> Ok, avfärd från sajens om ' + minutes + ' minut(er)' + (data.lunch.place ? ' mot ' + data.lunch.place : '') + '!');

            // Clear existing timer before creating a new one.
            if (data.lunch.timer !== null) {
              clearInterval(data.lunch.timer);
            }

            // Create timer
            data.lunch.timer = setTimeout(function () {
                clearInterval(data.lunch.interval);
                message.channel.send('@everyone Nu är det dags att gå' + (data.lunch.place ? ' till ' + data.lunch.place : '') + '!!');
                data.lunch.next = null;
                data.lunch.timer = null;
            }, moment(data.lunch.next).diff(moment(), 'ms'));

        } else {
            // No argument, do we have a next lunch set?
            if (data.lunch.next) {
                // Yes - calculate number of minutes until lunch.
                let minutes = moment(data.lunch.next).diff(moment(), 'm');

                // Make sure we haven't missed lunch.
                if (minutes > 0) {
                    message.channel.send('<@!' + message.author.id + '> avfärd för lunch om ' + minutes + ' minut(er)' + (data.lunch.place ? ' mot ' + data.lunch.place : '') + '!');
                } else {
                    // We missed lunch - reset and return a message.
                    data.lunch.next = null;
                    message.channel.send('<@!' + message.author.id + '> Vet inte när nästa lunch är :(');
                }
            } else {
                // No lunch set - return message.
                message.channel.send('<@!' + message.author.id + '> Vet inte när nästa lunch är :(');
            }
        }
    }
};
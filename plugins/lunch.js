/**
 * Lunch plugin
 * @module plugins/lunch
 * @author Hampus Nordin, https://github.com/hampusn
 */

const moment = require('moment');
const helpers = require('../lib/helpers');
const _ = require('lodash');

const validTimeFormats = [
  'HH.mm',
  'HH:mm',
  'HH.mm.ss',
  'HH:mm:ss'
];

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

        let now = new Date();

        // Did we get an argument?
        if (args[0]) {
            let time = moment(args[0], validTimeFormats, true);
            let now;

            if (!time.isValid()) {
                message.channel.send(`<@!${message.author.id}> Förstod inte det där..`);
                return;
            }

            // Assume next day if time has already passed today.
            if (time.isBefore(now)) {
                time.add(1, 'd');
            }

            data.lunch.place = args.length > 1 ? args.slice(1).join(' ') : null;

            // Save minutes and return message.
            data.lunch.next = time;
            message.channel.send(`<@!${message.author.id}> Ok, avfärd från sajens ${time.fromNow()}${(data.lunch.place ? ' mot ' + data.lunch.place : '')}!`);

            // Clear existing timer before creating a new one.
            if (data.lunch.timer !== null) {
                clearTimeout(data.lunch.timer);
            }

            // Create timer
            data.lunch.timer = setTimeout(function () {
                message.channel.send('@everyone Nu är det dags att gå' + (data.lunch.place ? ' till ' + data.lunch.place : '') + '!!');
                data.lunch.next = null;
                data.lunch.timer = null;
            }, time.diff(now, 'ms'));

        } else {
            // No argument, do we have a next lunch set?
            if (data.lunch.next) {
                // Make sure we haven't missed lunch.
                if (data.lunch.next.isAfter(now)) {
                    message.channel.send(`<@!${message.author.id}> avfärd för lunch från sajens ${data.lunch.next.fromNow()}${data.lunch.place ? ' mot ' + data.lunch.place : ''}!`);
                } else {
                    // We missed lunch - reset and return a message.
                    data.lunch.next = null;
                    message.channel.send(`<@!${message.author.id}> Vet inte när nästa lunch är :(`);
                }
            } else {
                // No lunch set - return message.
                message.channel.send(`<@!${message.author.id}> Vet inte när nästa lunch är :(`);
            }
        }
    }
};
/**
 * Helpers
 * @module lib/helpers
 * @author Magnus Palm, https://github.com/trippo80
 */

module.exports = {
    getCommand: (message) => {
        // Make sure message contains a command.
        if (message.content.substring(0, 1) !== '!') {
            return false;
        }

        // Split the message to find the command.
        let messageParts = message.content.substring(1).split(' ');

        // Did we get a command?
        if (messageParts[0]) {
            // Yes - return it.
            return messageParts[0];
        }

        // Did not find a command name in message.
        return false;
    },
    getCommandArguments: (message) => {
        // Make sure message contains a command.
        if (message.content.substring(0, 1) !== '!') {
            return false;
        }

        // Split the message.
        let messageParts = message.content.substring(1).split(' ');
        if (! messageParts) {
            return false;
        }

        // First part is the command name, remove it from array.
        const arguments = messageParts.splice(1);

        // Return.
        return arguments;
    }
};
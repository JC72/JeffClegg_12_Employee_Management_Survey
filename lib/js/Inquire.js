//This is the general inquirer constructor that server.js
//will pass all the neccesary info in and store it then pass it
// back to server.js to be run all the necessary queries.

const inquirer = require('inquirer');

class InqFuncs {
    constructor(type, name, message, choices) {
        this.type = type;
        this.name = name;
        this.message = message;
        this.choices = choices;
    }

    ask() {
        const askItem = {
            type: this.type,
            name: this.name,
            message: this.message
        }
        if(this.choices === 'undefined') {
            return askItem
        }
        else {
            askItem.choices = this.choices;
            return askItem;
        }
    }
}

module.exports = InqFuncs;
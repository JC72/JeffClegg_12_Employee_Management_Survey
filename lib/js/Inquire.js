//This is the general inquirer constructor that server.js
//will pass the all the neccesary info in and store it then pass it
// back to server.js to be run all the necessary queries.

const inquirer = require('inquirer');

class InqFunc {
    constructor(type, name, prompted, selection) {
        this.type = type;
        this.name = name;
        this.prompted = prompted;
        this.selection = selection;
    }

    begin() {
        const beginItem = {
            type: this.type,
            name: this.name,
            prompted: this.name,
        }
        if(this.selection === 'undefined') {
            return beginItem
        }
        else {
            beginItem.selection = this.selection;
            return beginItem
        }
    }
}

module.exports = InqFunc;
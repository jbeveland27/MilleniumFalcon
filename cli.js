/**
 * Facilitates a readLine loop
 * Created by Joseph Tan on 22/05/2016.
 */
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let choice;

function getChoice() {
    return choice;
}

function recursiveAsyncReadLine(callback) {
    rl.question("Please Choose an option:\n"
        + "1) h -- run hyperspeed\n"
        + "2) exit \n"
        , function (line) {
            if (line !== "exit") {
                callback(line);
            } else {
                // TODO: figure out the ps-tree kill to kill all child procs
                process.exit();
            }
    recursiveAsyncReadLine(callback); //Calling this function again to ask new question
    });
};

module.exports.recursiveAsyncReadLine = recursiveAsyncReadLine;
module.exports.getChoice = getChoice;
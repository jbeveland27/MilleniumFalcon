/**
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
                // figure out the ps-tree kill thing...
                process.exit();
            }
               
            // choice = line;
            // switch (line){
            //     case "h":
            //         console.log("this is option 1");
            //         break;
            //     case "2":
            //         console.log("this is option 2");
            //         break;
            //     case "3":
            //         return rl.close();
            //     default:
            //         console.log("No such option. Please enter another: ");
            // }
    recursiveAsyncReadLine(callback); //Calling this function again to ask new question
    });
};

module.exports.recursiveAsyncReadLine = recursiveAsyncReadLine;
module.exports.getChoice = getChoice;
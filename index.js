const p = require('./c.json');
const inquirer = require('inquirer');

_run();

function Filter(content) {
    const NSFW = p.nsfw;
    const DisAllowed = p.disallow
    const minor = p.minor;
    const mid = p.mid;

    for (const term of DisAllowed) {
        if (content.toLowerCase().includes(term)) return 0;
    }

    for (const term of NSFW) {
        if (content.toLowerCase().includes(term)) return 1;
    }

    for (const term of mid) {
        if (content.toLowerCase().includes(term)) return 2;
    }

    for (const term of minor) {
        if (content.toLowerCase().includes(term)) return 3;
    }

    return 4;
}

async function _test(content) {
    const res = await Filter(content);

    console.log(`Allowed with NSFW filtering only? ${1 <= res}`)
    console.log(`Allowed with Normal filtering only? ${res >= 2}`)
    console.log(`Allowed with Safety filtering only? ${res >= 3}`)
    console.log(`Allowed with Maximum filtering only? ${res >= 4}`);
    console.log(res);
}

async function _run() {
    while (true) {
        let handled = false;
        const answers = await inquirer.prompt({
            name: 'cmd',
            type: 'input',
            message: 'What would you like to do?',
            default() {
                return 'help';
            }
        })

        const cmd = answers.cmd.toLowerCase();

        if (cmd == "exit") process.exit(1);
        if (cmd == "clear") {
            handled = true;
            const { exec } = require('child_process');
            exec('clear', { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
                // do whatever with stdout
            })
        }
        if (cmd == "help") {
            handled = true;
            console.log('You can use the following commands\n\nexit - Exits the program\ntest - Test a string flag\nhelp - bring up this menu');
        }

        if (cmd == "test") {
            handled = true;
            const termMon = await inquirer.prompt({
                name: 'term',
                type: 'input',
                message: 'What term would you like to test?',
                default() {
                    return 'nice';
                }
            })

            _test(termMon.term);
        }

        if (!handled) {
            console.log("Invalid command, use 'help' to get all commands");
        }
    }
}

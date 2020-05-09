const jsf = require('json-schema-faker');
const chalk = require('chalk');
const schema = require('./schemes');
const fs = require('fs');

const json = JSON.stringify(jsf.generate(schema));

// check if folder exists
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

fs.writeFile("./data/db.json", json, function (err) {
  if (err) {
    return console.log(chalk.bold.red(err));
  } else {
    console.log(chalk.bold.green("Mock data generated."));
  }
});

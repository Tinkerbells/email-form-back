const chalk = require("chalk");
export default class Logging {
  static log = () => this.info(args);
  static info = () =>
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.blueBright(args) : args
    );
  static warning = () =>
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [WARN]`),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );
  static error = () =>
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [ERROR]`),
      typeof args === "string" ? chalk.redBright(args) : args
    );
}

import AbstractLogger from './AbstractLogger.js';

export default class ConsoleLogger extends AbstractLogger {
  // Non-static because correcponding method in parent class is non-static
  // eslint-disable-next-line class-methods-use-this
  addLog(message) {
    process.stdout.write(`${message}\n`);
  }
}

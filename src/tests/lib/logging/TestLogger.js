import AbstractLogger from '../../../lib/logging/AbstractLogger.js';

export default class TestLogger extends AbstractLogger {
  constructor(level) {
    super(level);
    this.logs = [];
  }

  addLog(message) {
    this.logs.push(message);
  }
}
